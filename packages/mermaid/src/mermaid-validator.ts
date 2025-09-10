/**
 * Mermaid Validator - Lightweight validation without rendering
 */

import './stubs/dom-stub.js';
import * as configApi from './config.js';
import { addDiagrams } from './diagram-api/diagram-orchestration.js';
import { detectType } from './diagram-api/detectType.js';
import { getDiagram, registerDiagram } from './diagram-api/diagramAPI.js';
import { preprocessDiagram } from './preprocess.js';
import { FlowDBValidator } from './diagrams/flowchart/flowDbValidator.js';
import type { ParseOptions, ParseResult } from './types.js';

// Override the regular FlowDB with validation-only version
import flowDiagram from './diagrams/flowchart/flowDiagram.js';

// Replace the original DB with our validation-only version
const originalDb = flowDiagram.db;
flowDiagram.db = new FlowDBValidator();

/**
 * Validate a mermaid diagram without rendering
 * @param text - The mermaid diagram definition
 * @param parseOptions - Options for parsing
 * @returns Validation result with diagram type if valid, false if invalid
 */
export async function validate(
  text: string,
  parseOptions?: ParseOptions
): Promise<ParseResult | false> {
  addDiagrams();
  
  try {
    const processed = preprocessDiagram(text);
    configApi.reset();
    configApi.addDirective(processed.config ?? {});
    
    const type = detectType(processed.code, configApi.getConfig());
    const { db, parser, init } = getDiagram(type);
    
    if (parser.parser) {
      parser.parser.yy = db;
    }
    
    db.clear?.();
    init?.(configApi.getConfig());
    
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
  try {
    getDiagram(diagramType);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get list of supported diagram types
 */
export function getSupportedDiagrams(): string[] {
  return [
    'flowchart',
    'graph',
    'sequenceDiagram',
    'classDiagram',
    'stateDiagram',
    'erDiagram',
    'gantt',
    'journey',
    'gitGraph',
    'pie',
    'quadrantChart',
    'requirement',
    'timeline',
    'mindmap',
    'architecture',
    'packet',
    'radar',
    'sankey',
    'block',
    'treemap',
    'kanban',
    'c4Context',
    'c4Container',
    'c4Component',
    'c4Dynamic',
    'c4Deployment',
  ];
}

/**
 * Parse a diagram and return structured information without validation errors
 * Useful for extracting metadata from diagrams
 */
export async function parse(text: string): Promise<{ 
  type: string; 
  config?: any; 
  valid: boolean;
  error?: string;
}> {
  try {
    const result = await validate(text, { suppressErrors: false });
    if (result) {
      return {
        type: result.diagramType,
        config: result.config,
        valid: true,
      };
    }
    return {
      type: 'unknown',
      valid: false,
    };
  } catch (error) {
    return {
      type: 'unknown',
      valid: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export default {
  validate,
  parse,
  isSupported,
  getSupportedDiagrams,
};