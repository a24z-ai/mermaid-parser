#!/usr/bin/env bun
/**
 * Simple build script for the validation-only package
 */
import { resolve } from 'path';

const stubsDir = resolve(import.meta.dir, '../src/stubs');

console.log('🚀 Building validation-only Mermaid package...');

const result = await Bun.build({
  entrypoints: [resolve(import.meta.dir, '../src/mermaid-validator.ts')],
  outdir: resolve(import.meta.dir, '../dist'),
  naming: 'mermaid-validator.[ext]',
  target: 'node',
  format: 'esm',
  minify: true,
  sourcemap: true,
  splitting: false,
  treeshaking: true,
  external: [
    // Keep some essential dependencies external
    'js-yaml',
    'lodash-es',
    '@mermaid-js/parser',
  ],
  define: {
    'process.env.NODE_ENV': '"production"',
    'includeLargeFeatures': 'false',
  },
  alias: {
    // Alias heavy dependencies to stubs
    'd3': resolve(stubsDir, 'd3-stub.ts'),
    'd3-selection': resolve(stubsDir, 'd3-stub.ts'),
    'd3-shape': resolve(stubsDir, 'd3-stub.ts'),
    'd3-scale': resolve(stubsDir, 'd3-stub.ts'),
    'd3-array': resolve(stubsDir, 'd3-stub.ts'),
    'd3-interpolate': resolve(stubsDir, 'd3-stub.ts'),
    'dompurify': resolve(stubsDir, 'dompurify-stub.ts'),
    'isomorphic-dompurify': resolve(stubsDir, 'dompurify-stub.ts'),
    'dagre-d3-es': resolve(stubsDir, 'dagre-stub.ts'),
    'dagre': resolve(stubsDir, 'dagre-stub.ts'),
    'cytoscape': resolve(stubsDir, 'empty-stub.ts'),
    'cytoscape-cose-bilkent': resolve(stubsDir, 'empty-stub.ts'),
    'cytoscape-fcose': resolve(stubsDir, 'empty-stub.ts'),
    'roughjs': resolve(stubsDir, 'empty-stub.ts'),
    '@braintree/sanitize-url': resolve(stubsDir, 'sanitize-url-stub.ts'),
    'elkjs': resolve(stubsDir, 'empty-stub.ts'),
    'web-worker': resolve(stubsDir, 'empty-stub.ts'),
    'khroma': resolve(stubsDir, 'khroma-stub.ts'),
    'dayjs': resolve(stubsDir, 'dayjs-stub.ts'),
    './schemas/config.schema.yaml?only-defaults=true': resolve(stubsDir, 'yaml-stub.ts'),
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

// Print size information
for (const output of result.outputs) {
  const sizeKB = Math.round(output.size / 1024);
  const originalEstimate = 2000; // ~2MB original mermaid
  const reduction = Math.round(((originalEstimate - sizeKB) / originalEstimate) * 100);
  
  console.log(`📦 ${output.kind}: ${sizeKB}KB (${reduction}% reduction from full mermaid)`);
}