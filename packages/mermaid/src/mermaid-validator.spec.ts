import { describe, expect, test } from 'bun:test';
import { validate, parse, isSupported, getSupportedDiagrams } from './mermaid-validator.js';

describe('Mermaid Validator', () => {
  test('validates correct flowchart syntax', async () => {
    const result = await validate('graph TD\n  A-->B');
    expect(result).toBeTruthy();
    expect(result && result.diagramType).toBe('flowchart');
  });

  test('rejects invalid syntax', async () => {
    const result = await validate('invalid syntax', { 
      suppressErrors: true 
    });
    expect(result).toBe(false);
  });

  test('validates sequence diagram', async () => {
    const result = await validate(`
      sequenceDiagram
        Alice->>Bob: Hi Bob
        Bob->>Alice: Hi Alice
    `);
    expect(result).toBeTruthy();
    expect(result && result.diagramType).toBe('sequence');
  });

  test('validates class diagram', async () => {
    const result = await validate(`
      classDiagram
        class Animal {
          +name: string
          +makeSound()
        }
    `);
    expect(result).toBeTruthy();
    expect(result && result.diagramType).toBe('class');
  });

  test('validates state diagram', async () => {
    const result = await validate(`
      stateDiagram-v2
        [*] --> Still
        Still --> [*]
        Still --> Moving
        Moving --> Still
        Moving --> Crash
        Crash --> [*]
    `);
    expect(result).toBeTruthy();
    expect(result && result.diagramType).toBe('state');
  });

  test('parse function returns detailed information', async () => {
    const result = await parse('graph TD\n  A-->B');
    expect(result.valid).toBe(true);
    expect(result.type).toBe('flowchart');
    expect(result.error).toBeUndefined();
  });

  test('parse function handles errors gracefully', async () => {
    const result = await parse('invalid syntax');
    expect(result.valid).toBe(false);
    expect(result.type).toBe('unknown');
    expect(result.error).toBeDefined();
  });

  test('isSupported checks diagram type support', () => {
    expect(isSupported('flowchart')).toBe(true);
    expect(isSupported('sequence')).toBe(true);
    expect(isSupported('nonexistent')).toBe(false);
  });

  test('getSupportedDiagrams returns list of supported types', () => {
    const supported = getSupportedDiagrams();
    expect(supported).toBeInstanceOf(Array);
    expect(supported.length).toBeGreaterThan(0);
    expect(supported).toContain('flowchart');
    expect(supported).toContain('sequenceDiagram');
    expect(supported).toContain('classDiagram');
  });

  test('validates gantt diagram', async () => {
    const result = await validate(`
      gantt
        title A Gantt Diagram
        section Section
        A task: a1, 2024-01-01, 30d
    `);
    expect(result).toBeTruthy();
    expect(result && result.diagramType).toBe('gantt');
  });

  test('validates pie chart', async () => {
    const result = await validate(`
      pie title Pie Chart
        "Dogs" : 386
        "Cats" : 85
        "Rats" : 15
    `);
    expect(result).toBeTruthy();
    expect(result && result.diagramType).toBe('pie');
  });

  test('handles complex flowchart with styling', async () => {
    const result = await validate(`
      graph TB
        A[Start] --> B{Decision}
        B -->|Yes| C[Process 1]
        B -->|No| D[Process 2]
        C --> E[End]
        D --> E
        classDef startEnd fill:#f9f,stroke:#333,stroke-width:4px;
        class A,E startEnd;
    `);
    expect(result).toBeTruthy();
    expect(result && result.diagramType).toBe('flowchart');
  });
});