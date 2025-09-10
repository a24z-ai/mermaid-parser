/**
 * Bun build configuration for validation-only Mermaid package
 */
import { resolve } from 'path';

const stubsDir = resolve(__dirname, 'src/stubs');

const buildResult = await Bun.build({
  entrypoints: ['./src/mermaid-validator.ts'],
  outdir: './dist',
  target: 'node',
  format: 'esm',
  minify: true,
  sourcemap: true,
  splitting: false, // Keep everything in one file for simplicity
  treeshaking: true,
  external: [], // Bundle everything
  define: {
    'process.env.NODE_ENV': '"production"',
    // Disable large features that aren't needed for validation
    'includeLargeFeatures': 'false',
  },
  plugins: [
    {
      name: 'stub-dependencies',
      setup(build) {
        // Alias heavy dependencies to our stubs
        const stubMappings = {
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
        };

        // Register resolvers for stubbed dependencies
        for (const [original, stub] of Object.entries(stubMappings)) {
          build.onResolve({ filter: new RegExp(`^${original}$`) }, () => ({
            path: stub,
          }));
        }
      },
    },
  ],
});

if (!buildResult.success) {
  console.error('Build failed:');
  for (const message of buildResult.logs) {
    console.error(message);
  }
  process.exit(1);
} else {
  console.log('✅ Validation-only build completed successfully!');
  
  // Print bundle size info
  for (const output of buildResult.outputs) {
    const sizeKB = Math.round(output.size / 1024);
    console.log(`📦 ${output.path}: ${sizeKB}KB`);
  }
}

export default buildResult;