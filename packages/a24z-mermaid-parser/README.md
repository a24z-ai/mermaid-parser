# @a24z/mermaid-parser

[![npm version](https://badge.fury.io/js/@a24z%2Fmermaid-parser.svg)](https://badge.fury.io/js/@a24z%2Fmermaid-parser)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **Lightweight Mermaid diagram validator for server-side environments**

A validation-only version of Mermaid that provides syntax checking without the heavy rendering dependencies. Perfect for server-side validation, CI/CD pipelines, API endpoints, and any environment where you need to validate Mermaid diagram syntax without rendering.

## ✨ Key Features

- **🪶 Ultra-lightweight**: ~50KB vs ~2MB (97% smaller than full Mermaid)
- **⚡ Fast**: No rendering overhead, pure syntax validation
- **🌐 Universal**: Works in Node.js, Deno, Bun, browsers, and serverless functions
- **📝 Complete**: Supports all Mermaid diagram types
- **🔒 Safe**: No DOM dependencies, perfect for server environments
- **📦 Zero config**: Import and use immediately

## 📋 Supported Diagram Types

- **Flowcharts** (`graph`, `flowchart`)
- **Sequence Diagrams** (`sequenceDiagram`)
- **Class Diagrams** (`classDiagram`)
- **State Diagrams** (`stateDiagram`, `stateDiagram-v2`)
- **Entity Relationship** (`erDiagram`)
- **User Journey** (`journey`)
- **Gantt Charts** (`gantt`)
- **Pie Charts** (`pie`)
- **Git Graphs** (`gitGraph`)
- **Mindmaps** (`mindmap`)
- **Timelines** (`timeline`)
- **Quadrant Charts** (`quadrantChart`)
- **Requirement Diagrams** (`requirementDiagram`)
- **C4 Diagrams** (`C4Context`, `C4Container`, etc.)
- **Sankey Diagrams** (`sankey-beta`)
- **Block Diagrams** (`block-beta`)
- **Packet Diagrams** (`packet-beta`)
- **Architecture Diagrams** (`architecture-beta`)
- **XY Charts** (`xychart-beta`)

## 🚀 Installation

```bash
npm install @a24z/mermaid-parser
```

```bash
yarn add @a24z/mermaid-parser
```

```bash
pnpm add @a24z/mermaid-parser
```

```bash
bun add @a24z/mermaid-parser
```

## 💡 Usage

### Basic Validation

```typescript
import { validate } from '@a24z/mermaid-parser';

// Validate a flowchart
const result = await validate(`
  graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Success]
    B -->|No| D[Retry]
    D --> A
`);

if (result) {
  console.log(`✅ Valid ${result.diagramType} diagram`);
  console.log('Config:', result.config);
} else {
  console.log('❌ Invalid diagram');
}
```

### Error Handling

```typescript
import { validate, parse } from '@a24z/mermaid-parser';

// With error suppression
const result = await validate('invalid syntax', { suppressErrors: true });
console.log(result); // false

// With detailed error information
const detailed = await parse('invalid syntax');
console.log(detailed);
// { type: 'unknown', valid: false, error: 'Unknown diagram type' }
```

### Type Checking

```typescript
import { isSupported, getSupportedDiagrams, getDiagramType } from '@a24z/mermaid-parser';

// Check if a diagram type is supported
console.log(isSupported('flowchart')); // true
console.log(isSupported('custom')); // false

// Get all supported types
console.log(getSupportedDiagrams());
// ['flowchart', 'sequence', 'class', 'state', ...]

// Detect diagram type without validation
const type = getDiagramType('sequenceDiagram\nAlice->Bob: Hi');
console.log(type); // 'sequence'
```

## 🌐 Use Cases

### Express.js API Endpoint

```javascript
import express from 'express';
import { validate } from '@a24z/mermaid-parser';

const app = express();
app.use(express.json());

app.post('/api/validate-diagram', async (req, res) => {
  const { diagram } = req.body;
  
  try {
    const result = await validate(diagram);
    if (result) {
      res.json({ 
        valid: true, 
        type: result.diagramType,
        config: result.config 
      });
    } else {
      res.status(400).json({ 
        valid: false, 
        error: 'Invalid diagram syntax' 
      });
    }
  } catch (error) {
    res.status(400).json({ 
      valid: false, 
      error: error.message 
    });
  }
});
```

### AWS Lambda Function

```javascript
import { validate } from '@a24z/mermaid-parser';

export const handler = async (event) => {
  const { diagram } = JSON.parse(event.body);
  
  const result = await validate(diagram, { suppressErrors: true });
  
  return {
    statusCode: result ? 200 : 400,
    body: JSON.stringify({
      valid: !!result,
      diagramType: result?.diagramType,
    }),
  };
};
```

### GitHub Actions CI/CD

```yaml
name: Validate Mermaid Diagrams
on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: oven-sh/setup-bun@v1
      - run: bun install @a24z/mermaid-parser
      - run: |
          bun -e "
          import { validate } from '@a24z/mermaid-parser';
          import { readFileSync } from 'fs';
          
          const diagram = readFileSync('docs/architecture.mmd', 'utf8');
          const result = await validate(diagram);
          
          if (!result) {
            console.error('❌ Invalid diagram in docs/architecture.mmd');
            process.exit(1);
          }
          
          console.log(\`✅ Valid \${result.diagramType} diagram\`);
          "
```

### Next.js API Route

```typescript
// pages/api/validate.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { validate } from '@a24z/mermaid-parser';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { diagram } = req.body;
  
  const result = await validate(diagram, { suppressErrors: true });
  
  res.status(result ? 200 : 400).json({
    valid: !!result,
    type: result?.diagramType,
    config: result?.config,
  });
}
```

### Deno Script

```typescript
import { validate } from 'npm:@a24z/mermaid-parser';

const diagram = await Deno.readTextFile('./diagram.mmd');
const result = await validate(diagram);

if (result) {
  console.log(`✅ Valid ${result.diagramType} diagram`);
} else {
  console.log('❌ Invalid diagram');
  Deno.exit(1);
}
```

## 📊 Performance Comparison

| Package | Size | Load Time | Memory Usage | Use Case |
|---------|------|-----------|--------------|----------|
| `mermaid` (full) | ~2MB | ~500ms | ~50MB | Browser rendering |
| `@a24z/mermaid-parser` | ~50KB | ~10ms | ~5MB | Server validation |

## 🔧 API Reference

### `validate(text: string, options?: ParseOptions): Promise<ParseResult | false>`

Validates a Mermaid diagram and returns the result.

**Parameters:**
- `text`: The Mermaid diagram definition
- `options.suppressErrors`: If true, returns `false` instead of throwing errors

**Returns:**
- `ParseResult` with `diagramType` and `config` if valid
- `false` if invalid (when `suppressErrors: true`)
- Throws error if invalid (when `suppressErrors: false`)

### `parse(text: string): Promise<DetailedParseResult>`

Parses a diagram and returns detailed information including errors.

### `isSupported(diagramType: string): boolean`

Checks if a diagram type is supported.

### `getSupportedDiagrams(): string[]`

Returns array of all supported diagram types.

### `getDiagramType(text: string): string`

Detects diagram type without full validation.

## 🏗️ Architecture

This package provides a lightweight alternative by:

1. **Stubbing DOM APIs** - Provides browser globals for Node.js environments
2. **Pattern-based detection** - Uses regex patterns instead of full parsers
3. **Syntax validation** - Validates basic syntax rules for each diagram type
4. **Zero rendering** - No D3.js, no SVG generation, no layout calculation
5. **Minimal dependencies** - Only `js-yaml` for config parsing

## 🤝 Contributing

Contributions are welcome! This package aims to be:

- **Lightweight**: Keep bundle size minimal
- **Compatible**: Work in all JavaScript environments  
- **Accurate**: Match Mermaid's diagram type detection
- **Fast**: Optimize for validation speed

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🔗 Related

- [Mermaid](https://mermaid.js.org/) - The original Mermaid library
- [Mermaid Live Editor](https://mermaid.live/) - Online Mermaid editor
- [Mermaid CLI](https://github.com/mermaid-js/mermaid-cli) - Command line tool

## 📈 Changelog

See [CHANGELOG.md](CHANGELOG.md) for release history.

---

**Made with ❤️ for the Mermaid community**