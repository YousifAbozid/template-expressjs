#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateOpenApiSpec } from '../src/swagger/index.js';
// Import your controllers here
// Example: import { UserController } from '../src/controllers/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateSpec() {
  try {
    console.log('🚀 Generating OpenAPI specification...');

    // List of controllers to process
    const controllers: any[] = []; // Add your controllers here
    // Example: const controllers = [UserController, ProductController];

    // Generate the OpenAPI specification
    const spec = generateOpenApiSpec(controllers);

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
    console.log(`   - ${controllers.length} controllers processed`);
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
