/**
 * Minimal Mermaid Validator - Only imports what's needed for parsing
 */

import './stubs/dom-stub.js';

// Only import the core parsing functionality
import { detectType } from './diagram-api/detectType.js';
import { preprocessDiagram } from './preprocess.js';

// Import diagram registrations one by one to avoid heavy dependencies
import flowDetector from './diagrams/flowchart/flowDetector.js';
import sequenceDetector from './diagrams/sequence/sequenceDetector.js';
import classDetector from './diagrams/class/classDetector.js';
import stateDetector from './diagrams/state/stateDetector.js';
import erDetector from './diagrams/er/erDetector.js';
import ganttDetector from './diagrams/gantt/ganttDetector.js';
import pieDetector from './diagrams/pie/pieDetector.js';

import type { ParseOptions, ParseResult } from './types.js';

// Register only essential diagrams
const diagrams = [
  flowDetector,
  sequenceDetector, 
  classDetector,
  stateDetector,
  erDetector,
  ganttDetector,
  pieDetector,
];

// Simple diagram registry
const diagramRegistry = new Map();
for (const detector of diagrams) {
  diagramRegistry.set(detector.id, detector);
}

/**
 * Validate a mermaid diagram without rendering
 */
export async function validate(
  text: string,
  parseOptions?: ParseOptions
): Promise<ParseResult | false> {
  try {
    const processed = preprocessDiagram(text);
    const type = detectType(processed.code, {});
    
    const detector = diagramRegistry.get(type);
    if (!detector) {
      if (parseOptions?.suppressErrors) {
        return false;
      }
      throw new Error(`Unsupported diagram type: ${type}`);
    }

    // Simple parsing test - if it doesn't throw, it's valid
    const { parser } = detector.detector(text, {});
    await parser.parse(processed.code);
    
    return { 
      diagramType: type, 
      config: processed.config 
    };
  } catch (error) {
    if (parseOptions?.suppressErrors) {
      return false;
    }
    throw error;
  }
}

/**
 * Check if a diagram type is supported
 */
export function isSupported(diagramType: string): boolean {
  return diagramRegistry.has(diagramType);
}

/**
 * Get list of supported diagram types
 */
export function getSupportedDiagrams(): string[] {
  return Array.from(diagramRegistry.keys());
}

export default {
  validate,
  isSupported,
  getSupportedDiagrams,
};