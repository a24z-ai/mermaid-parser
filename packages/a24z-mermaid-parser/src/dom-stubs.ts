/**
 * DOM stubs for non-browser environments
 * Used in the validation-only build to provide browser APIs
 */

// Skip TypeScript global declarations to avoid conflicts

// Only create globals if they don't exist (avoid conflicts in browser)
if (typeof globalThis !== 'undefined') {
  if (typeof window === 'undefined') {
    (globalThis as any).window = {
      scrollX: 0,
      scrollY: 0,
      location: { href: '' },
      navigator: { userAgent: 'mermaid-validator' },
      addEventListener: () => {},
      removeEventListener: () => {},
      getComputedStyle: () => ({
        getPropertyValue: () => '',
      }),
    };
  }

  if (typeof document === 'undefined') {
    (globalThis as any).document = {
      querySelector: () => null,
      querySelectorAll: () => [],
      getElementById: () => null,
      getElementsByClassName: () => [],
      getElementsByTagName: () => [],
      createElement: () => ({
        tagName: 'div',
        style: {},
        setAttribute: () => {},
        getAttribute: () => null,
        removeAttribute: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        appendChild: () => {},
        removeChild: () => {},
        getBoundingClientRect: () => ({
          top: 0, left: 0, right: 0, bottom: 0,
          width: 100, height: 20, x: 0, y: 0,
        }),
        innerHTML: '',
        textContent: '',
        childNodes: [],
        classList: {
          add: () => {},
          remove: () => {},
          contains: () => false,
        },
      }),
      createElementNS: () => ({
        setAttribute: () => {},
        getAttribute: () => null,
        getBBox: () => ({ x: 0, y: 0, width: 100, height: 20 }),
      }),
      createTextNode: () => ({}),
      body: { appendChild: () => {}, style: {} },
    };
  }

  if (typeof Element === 'undefined') {
    (globalThis as any).Element = class Element {
      setAttribute() {}
      getAttribute() { return null; }
      removeAttribute() {}
    };
  }
}

export {};