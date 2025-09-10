import type { DiagramDB } from '../../diagram-api/types.js';
import { FlowDB } from './flowDb.js';

/**
 * Validation-only version of FlowDB
 * Removes DOM-dependent methods used only for rendering
 */
export class FlowDBValidator extends FlowDB implements DiagramDB {
  constructor() {
    super();
    // Clear the funs array - these are rendering-only functions
    this.clearFuns();
  }

  private clearFuns() {
    // Access the private funs array through type assertion
    (this as any).funs = [];
  }

  // Override DOM-dependent methods with no-ops
  public bindFunctions(_element: Element) {
    // No-op: DOM binding not needed for validation
  }

  // Override the private setupToolTips method
  private setupToolTips(_element: Element) {
    // No-op: Tooltips not needed for validation
  }

  // Keep all parsing methods unchanged by inheriting from FlowDB
  // addVertex, addLink, setDirection, etc. remain the same
}