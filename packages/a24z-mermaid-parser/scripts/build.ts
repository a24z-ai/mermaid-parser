#!/usr/bin/env bun
/**
 * Build script for @a24z/mermaid-parser
 */
import { resolve } from 'path';

console.log('🚀 Building @a24z/mermaid-parser...');

// Build the main package
const result = await Bun.build({
  entrypoints: [resolve(import.meta.dir, '../src/index.ts')],
  outdir: resolve(import.meta.dir, '../dist'),
  target: 'node',
  format: 'esm',
  minify: process.argv.includes('--minify'),
  sourcemap: true,
  splitting: false,
  treeshaking: true,
  external: ['js-yaml'], // Keep js-yaml as external dependency
  define: {
    'process.env.NODE_ENV': '"production"',
  },
});

if (!result.success) {
  console.error('❌ Build failed:');
  for (const message of result.logs) {
    console.error(message);
  }
  process.exit(1);
}

console.log('✅ Build completed successfully!');

// Generate type definitions
const typeResult = await Bun.spawn({
  cmd: ['bun', 'x', 'tsc', '--declaration', '--emitDeclarationOnly', '--outDir', 'dist', 'src/index.ts'],
  cwd: resolve(import.meta.dir, '..'),
  stdout: 'inherit',
  stderr: 'inherit',
});

await typeResult.exited;

if (typeResult.exitCode !== 0) {
  console.error('❌ Type generation failed');
  process.exit(1);
}

// Print build information
const outputs = result.outputs;
let totalSize = 0;

console.log('\n📦 Build artifacts:');
for (const output of outputs) {
  const sizeKB = Math.round(output.size / 1024);
  totalSize += output.size;
  
  // Calculate estimated size reduction
  const fullMermaidSize = 2000; // ~2MB
  const reduction = Math.round(((fullMermaidSize - sizeKB) / fullMermaidSize) * 100);
  
  console.log(`   ${output.kind}: ${sizeKB}KB (~${reduction}% smaller than full mermaid)`);
}

const totalKB = Math.round(totalSize / 1024);
console.log(`\n🎉 Total package size: ${totalKB}KB`);
console.log('   Perfect for serverless, CI/CD, and API validation!');