/**
 * DOMPurify stub - sanitization not needed for validation
 */

export default {
  sanitize: (text: string) => text,
  isSupported: true,
  setConfig: () => {},
  addHook: () => {},
  removeHook: () => {},
  removeHooks: () => {},
  removeAllHooks: () => {},
};

export const sanitize = (text: string) => text;