#!/usr/bin/env node

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

import swaggerConfig from '../src/config/swagger.js';
// Import your controllers here if you have any
// Example: import { UserController } from '../src/controllers/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateSpec() {
  try {
    console.log('🚀 Generating OpenAPI specification...');

    // Use the merged swagger configuration
    const spec = swaggerConfig;

    // Ensure the output directory exists
    const outputDir = path.join(__dirname, '..', 'dist');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write the specification to a file
    const outputPath = path.join(outputDir, 'openapi.json');
    fs.writeFileSync(outputPath, JSON.stringify(spec, null, 2));

    // Also write to src directory for development
    const srcOutputPath = path.join(__dirname, '..', 'src', 'openapi.json');
    fs.writeFileSync(srcOutputPath, JSON.stringify(spec, null, 2));

    console.log('✅ OpenAPI specification generated successfully!');
    console.log(`📁 Output files:`);
    console.log(`   - ${outputPath}`);
    console.log(`   - ${srcOutputPath}`);

    // Log some statistics
    const pathCount = Object.keys(spec.paths).length;
    const schemaCount = Object.keys(spec.components.schemas).length;

    console.log(`📊 Statistics:`);
    console.log(`   - ${pathCount} API paths`);
    console.log(`   - ${schemaCount} schema definitions`);
    console.log(`   - Using JSDoc + Decorators for API documentation`);
  } catch (error) {
    console.error('❌ Error generating OpenAPI specification:', error);
    process.exit(1);
  }
}

// Run the generation if this script is executed directly
if (process.argv[1] === __filename) {
  generateSpec();
}

export { generateSpec };
