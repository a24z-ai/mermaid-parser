# @a24z/mermaid-parser Design Document

## Overview

`@a24z/mermaid-parser` is a lightweight, validation-only parser for Mermaid diagrams that provides syntax validation and rendering warnings without the heavy dependencies required for actual diagram rendering.

## Architecture

### Core Components

```
┌─────────────────────────────────────────────┐
│              User Input (String)             │
└─────────────────────┬───────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────┐
│           Preprocessing Stage               │
│  • Extract directives (%%{...}%%)           │
│  • Remove comments                          │
│  • Clean whitespace                         │
└─────────────────────┬───────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────┐
│         Diagram Type Detection              │
│  • Pattern matching against known types     │
│  • Returns: flowchart, sequence, class, etc │
└─────────────────────┬───────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────┐
│          Syntax Validation                  │
│  • Type-specific validation rules           │
│  • Basic structure checking                 │
└─────────────────────┬───────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────┐
│       Rendering Warning Detection           │
│  • Check for unsupported markdown           │
│  • Identify problematic patterns            │
└─────────────────────┬───────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────┐
│            Return Result                    │
│  • diagramType: string                      │
│  • config?: any                             │
│  • warnings?: string[]                      │
└─────────────────────────────────────────────┘
```

## API Design

### Core Functions

#### 1. `validate(text: string, options?: ParseOptions): Promise<ParseResult | false>`

**Purpose**: Primary validation function that checks if a Mermaid diagram is syntactically valid.

**Returns**:
```typescript
interface ParseResult {
  diagramType: string;  // e.g., "flowchart", "sequence", "class"
  config?: any;         // Extracted configuration from directives
  warnings?: string[];  // Rendering warnings (if any)
}
```

**Example**:
```javascript
const result = await validate('graph TD\n  A --> B');
// Returns: { diagramType: "flowchart" }

const resultWithWarnings = await validate('graph TD\n  A --> |1. Step| B');
// Returns: {
//   diagramType: "flowchart",
//   warnings: ["Edge label \"1. Step\" contains numbered list..."]
// }
```

#### 2. `parse(text: string): Promise<DetailedParseResult>`

**Purpose**: Extended parsing with detailed error information.

**Returns**:
```typescript
interface DetailedParseResult {
  type: string;
  config?: any;
  valid: boolean;
  error?: string;
  warnings?: string[];
}
```

#### 3. `getDiagramType(text: string): string`

**Purpose**: Quick type detection without full validation.

**Returns**: Diagram type string or "unknown".

#### 4. `isSupported(diagramType: string): boolean`

**Purpose**: Check if a diagram type is supported.

#### 5. `getSupportedDiagrams(): string[]`

**Purpose**: List all supported diagram types.

## Validation Rules

### Diagram Type Detection

Uses regex patterns to identify diagram types:

```javascript
const DIAGRAM_PATTERNS = {
  flowchart: /^\s*(graph|flowchart)(\s+TD|TB|BT|RL|LR)?/i,
  sequence: /^\s*sequenceDiagram/i,
  class: /^\s*classDiagram/i,
  state: /^\s*stateDiagram(-v2)?/i,
  // ... more patterns
};
```

### Syntax Validation

Each diagram type has specific validation rules:

#### Flowchart Validation
- Must have nodes (with brackets `[]`, parentheses `()`, or braces `{}`)
- OR must have arrows (`-->`, `---`, etc.)
- No invalid arrow syntax (e.g., `>>>`)

#### Sequence Diagram Validation
- Must have participants/actors OR interactions
- Pattern: `participant \w+` or `\w+ ->> \w+`

#### Class Diagram Validation
- Must have class definitions or relationships
- Pattern: `class \w+` or relationship arrows

## Warning Detection System

### Purpose
Detect patterns that are syntactically valid but may cause rendering issues.

### Current Warnings

#### 1. Numbered Lists in Labels
**Pattern**: `1. `, `2. `, etc.
**Issue**: Mermaid interprets as markdown list, causing "Unsupported markdown: list" error
**Example**:
```mermaid
graph LR
  A -->|1. Step One| B  // ⚠️ Warning
  A -->|(1) Step One| B // ✅ No warning
```

#### 2. Markdown Lists
**Pattern**: Lines starting with `- ` or `* `
**Issue**: Not supported in node/edge labels

#### 3. Markdown Headers
**Pattern**: Lines starting with `#`
**Issue**: May not render correctly

#### 4. Code Blocks
**Pattern**: Triple backticks ` ``` `
**Issue**: Not supported in labels

#### 5. HTML Tags
**Pattern**: `<tag>content</tag>`
**Issue**: May not render correctly

### Warning Detection Implementation

```javascript
function checkNodeLabels(text, diagramType) {
  const warnings = [];
  
  // Check node labels [...]
  const nodePattern = /\w+\[([^\]]+)\]/g;
  
  // Check edge labels |...|
  const edgePattern = /\|([^|]+)\|/g;
  
  // Test each label against problem patterns
  // Return array of warning messages
  
  return warnings;
}
```

## Return Value Examples

### Clean Diagram (No Warnings)
```javascript
await validate('graph TD\n  A[Start] --> B[End]')
// Returns:
{
  "diagramType": "flowchart"
}
```

### Diagram with Config
```javascript
await validate('%%{init: {"theme": "dark"}}%%\ngraph TD\n  A --> B')
// Returns:
{
  "diagramType": "flowchart",
  "config": {
    "init": {
      "theme": "dark"
    }
  }
}
```

### Diagram with Warnings
```javascript
await validate('graph TD\n  A -->|1. First Step| B')
// Returns:
{
  "diagramType": "flowchart",
  "warnings": [
    "Edge label \"1. First Step\" contains numbered list which may cause rendering issues"
  ]
}
```

### Invalid Diagram
```javascript
await validate('invalid syntax', { suppressErrors: true })
// Returns: false

await validate('invalid syntax')
// Throws: Error("Unknown diagram type")
```

## Performance Characteristics

- **Size**: ~10KB compressed (vs ~2MB for full Mermaid)
- **Speed**: ~1ms validation time for typical diagrams
- **Memory**: Minimal footprint, no DOM manipulation
- **Dependencies**: Only `js-yaml` for config parsing

## Use Cases

### 1. API Validation
```javascript
app.post('/api/diagram', async (req, res) => {
  const result = await validate(req.body.diagram);
  if (result && !result.warnings) {
    res.json({ success: true });
  } else if (result && result.warnings) {
    res.json({ success: true, warnings: result.warnings });
  } else {
    res.status(400).json({ error: 'Invalid diagram' });
  }
});
```

### 2. CI/CD Pipeline
```yaml
- name: Validate Diagrams
  run: |
    for file in docs/*.mmd; do
      npx @a24z/mermaid-parser validate "$file"
    done
```

### 3. Editor Integration
```javascript
// VS Code extension
vscode.languages.registerDocumentFormattingEditProvider('mermaid', {
  async provideDocumentFormattingEdits(document) {
    const result = await parse(document.getText());
    if (result.warnings) {
      // Show warnings to user
      vscode.window.showWarningMessage(result.warnings[0]);
    }
  }
});
```

## Design Decisions

### 1. Pattern-Based Detection
**Decision**: Use regex patterns instead of full parsing
**Rationale**: 
- 90% size reduction
- Sufficient for validation use cases
- Fast execution

### 2. Warning System
**Decision**: Separate warnings from errors
**Rationale**:
- Syntax can be valid but problematic for rendering
- Helps users avoid common pitfalls
- Non-breaking for existing valid diagrams

### 3. Async API
**Decision**: All main functions return Promises
**Rationale**:
- Future compatibility with async parsing
- Consistent with modern JavaScript patterns
- Allows for potential network-based validation

### 4. Minimal Dependencies
**Decision**: Only depend on `js-yaml`
**Rationale**:
- Keep package lightweight
- Reduce security surface
- Faster installation

## Future Enhancements

### Planned Features

1. **Streaming Validation**
   - Process large diagrams in chunks
   - Useful for real-time validation

2. **Custom Validators**
   - Plugin system for organization-specific rules
   - Extensible warning patterns

3. **AST Output**
   - Return parsed structure for analysis
   - Enable diagram transformations

4. **Error Recovery**
   - Continue parsing after errors
   - Provide multiple error messages

5. **WASM Build**
   - Even smaller size
   - Consistent behavior across platforms

## Comparison with Full Mermaid

| Aspect | @a24z/mermaid-parser | mermaid (full) |
|--------|---------------------|----------------|
| Size | ~10KB compressed | ~2MB compressed |
| Dependencies | 1 (js-yaml) | 20+ |
| Rendering | ❌ No | ✅ Yes |
| Validation | ✅ Yes | ✅ Yes |
| Warnings | ✅ Yes | ❌ No |
| Environment | Universal | Browser-focused |
| Load Time | ~10ms | ~500ms |
| Memory | ~5MB | ~50MB |

## Testing Strategy

### Unit Tests
- Each diagram type validation
- Warning detection accuracy
- Config extraction
- Error handling

### Integration Tests
- Real-world diagram examples
- Edge cases from GitHub issues
- Performance benchmarks

### Coverage Goals
- 100% of public API
- 90% of validation logic
- All warning patterns

## Security Considerations

### Input Validation
- Max input size: 1MB (configurable)
- No code execution
- No file system access
- No network requests

### Safe Parsing
- No `eval()` usage
- Regex patterns have timeout protection
- Memory-safe string operations

## Conclusion

`@a24z/mermaid-parser` provides a focused, lightweight solution for Mermaid diagram validation. By separating validation from rendering, it enables new use cases in server-side environments while maintaining compatibility with the Mermaid ecosystem.