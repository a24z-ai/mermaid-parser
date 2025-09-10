/**
 * Minimal D3 stub for validation-only build
 * D3 is only used during rendering phase, not parsing
 */

type Selection = {
  selectAll: () => Selection;
  select: () => Selection;
  append: () => Selection;
  attr: () => Selection;
  style: () => Selection;
  on: () => Selection;
  nodes: () => any[];
  classed: () => Selection;
  transition: () => Selection;
  duration: () => Selection;
  text: () => Selection;
  html: () => Selection;
  data: () => Selection;
  enter: () => Selection;
  exit: () => Selection;
  merge: () => Selection;
  each: () => Selection;
  call: () => Selection;
  remove: () => void;
  node: () => any;
  empty: () => boolean;
  size: () => number;
};

const createSelection = (): Selection => ({
  selectAll: () => createSelection(),
  select: () => createSelection(),
  append: () => createSelection(),
  attr: () => createSelection(),
  style: () => createSelection(),
  on: () => createSelection(),
  nodes: () => [],
  classed: () => createSelection(),
  transition: () => createSelection(),
  duration: () => createSelection(),
  text: () => createSelection(),
  html: () => createSelection(),
  data: () => createSelection(),
  enter: () => createSelection(),
  exit: () => createSelection(),
  merge: () => createSelection(),
  each: () => createSelection(),
  call: () => createSelection(),
  remove: () => {},
  node: () => null,
  empty: () => true,
  size: () => 0,
});

export const select = () => createSelection();
export const selectAll = () => createSelection();

// Export other D3 modules that might be imported
export const scaleOrdinal = () => () => '#000';
export const schemeCategory10 = ['#000'];
export const scaleLinear = () => ({
  domain: () => ({ range: () => ({}) }),
  range: () => ({ domain: () => ({}) }),
});
export const scaleBand = () => ({
  domain: () => ({ range: () => ({ padding: () => ({}) }) }),
  range: () => ({ domain: () => ({ padding: () => ({}) }) }),
  padding: () => ({ domain: () => ({ range: () => ({}) }) }),
});
export const arc = () => ({
  innerRadius: () => ({ outerRadius: () => ({ startAngle: () => ({ endAngle: () => ({}) }) }) }),
});
export const pie = () => ({
  value: () => ({ sort: () => ({}) }),
});
export const line = () => ({
  x: () => ({ y: () => ({ curve: () => ({}) }) }),
});
export const curveBasis = {};
export const curveLinear = {};
export const max = () => 0;
export const min = () => 0;
export const sum = () => 0;
export const extent = () => [0, 0];