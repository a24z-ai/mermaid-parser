/**
 * DOM stubs for non-browser environments
 */

declare global {
  var window: any;
  var document: any;
  var Element: any;
  var HTMLElement: any;
  var SVGElement: any;
}

if (typeof window === 'undefined') {
  global.window = {
    scrollX: 0,
    scrollY: 0,
    location: { href: '' },
    navigator: { userAgent: '' },
    addEventListener: () => {},
    removeEventListener: () => {},
    getComputedStyle: () => ({
      getPropertyValue: () => '',
    }),
  } as any;
}

if (typeof document === 'undefined') {
  global.document = {
    querySelector: () => null,
    querySelectorAll: () => [],
    getElementById: () => null,
    getElementsByClassName: () => [],
    getElementsByTagName: () => [],
    createElement: (tag: string) => ({
      tagName: tag,
      style: {},
      setAttribute: () => {},
      getAttribute: () => null,
      removeAttribute: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      appendChild: () => {},
      removeChild: () => {},
      insertBefore: () => {},
      replaceChild: () => {},
      cloneNode: () => ({}),
      contains: () => false,
      getBoundingClientRect: () => ({
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0,
        x: 0,
        y: 0,
      }),
      innerHTML: '',
      textContent: '',
      childNodes: [],
      firstChild: null,
      lastChild: null,
      parentNode: null,
      nextSibling: null,
      previousSibling: null,
      classList: {
        add: () => {},
        remove: () => {},
        toggle: () => {},
        contains: () => false,
      },
    }),
    createElementNS: () => ({
      setAttribute: () => {},
      getAttribute: () => null,
      getBBox: () => ({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      }),
    }),
    createTextNode: () => ({}),
    createDocumentFragment: () => ({
      appendChild: () => {},
    }),
    body: {
      appendChild: () => {},
      removeChild: () => {},
      style: {},
    },
    head: {
      appendChild: () => {},
    },
    documentElement: {
      style: {},
    },
  } as any;
}

if (typeof Element === 'undefined') {
  global.Element = class Element {
    setAttribute() {}
    getAttribute() {
      return null;
    }
    removeAttribute() {}
  };
}

if (typeof HTMLElement === 'undefined') {
  global.HTMLElement = class HTMLElement extends global.Element {};
}

if (typeof SVGElement === 'undefined') {
  global.SVGElement = class SVGElement extends global.Element {
    getBBox() {
      return { x: 0, y: 0, width: 0, height: 0 };
    }
  };
}

export {};