/**
 * Dagre stub for validation-only build
 * Dagre is only used for layout calculation, not parsing
 */

export const graphlib = {
  Graph: class Graph {
    setGraph() {}
    graph() {}
    setDefaultEdgeLabel() {}
    setNode() {}
    node() {}
    nodes() { return []; }
    setEdge() {}
    edges() { return []; }
    edge() {}
    predecessors() { return []; }
    successors() { return []; }
    filterNodes() { return new Graph(); }
  },
  alg: {
    isAcyclic: () => true,
    findCycles: () => [],
  },
  json: {
    write: () => ({}),
    read: () => new this.Graph(),
  },
};

export const layout = () => {};
export default { graphlib, layout };