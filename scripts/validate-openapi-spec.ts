#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function validateOpenApiSpec() {
  try {
    console.log('🔍 Validating OpenAPI specification...');

    const specPath = path.join(__dirname, '..', 'src', 'openapi.json');

    if (!fs.existsSync(specPath)) {
      console.log('📄 OpenAPI spec not found, generating it first...');
      const { exec } = await import('child_process');
      const { promisify } = await import('util');
      const execAsync = promisify(exec);
      await execAsync('npm run generate:api-spec');
    }

    // Basic validation by parsing JSON
    console.log('🔧 Validating JSON structure...');

    const specContent = fs.readFileSync(specPath, 'utf8');
    const spec = JSON.parse(specContent);

    // Basic OpenAPI 3.0 structure validation
    if (!spec.openapi || !spec.openapi.startsWith('3.0')) {
      throw new Error('Invalid OpenAPI version. Expected 3.0.x');
    }

    if (!spec.info || !spec.info.title || !spec.info.version) {
      throw new Error('Missing required info object with title and version');
    }

    if (!spec.paths || typeof spec.paths !== 'object') {
      throw new Error('Missing or invalid paths object');
    }

    console.log('✅ OpenAPI specification is valid!');
    console.log('📋 API Title:', spec.info.title);
    console.log('🏷️  Version:', spec.info.version);
    console.log('🛤️  Paths:', Object.keys(spec.paths).length);
    console.log(
      '📊 Schemas:',
      spec.components?.schemas ? Object.keys(spec.components.schemas).length : 0
    );
  } catch (error) {
    console.error(
      '❌ Validation failed:',
      error instanceof Error ? error.message : String(error)
    );
    process.exit(1);
  }
}

// Run validation if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  validateOpenApiSpec();
}

export { validateOpenApiSpec };
