export type FlowKind = "base" | "head";

export interface Flow {
  start: number;
  end: number;
  name: string;
  kind: FlowKind;
}

export interface Step {
  root: ViewNode;
  packageName: string;
  activity: string;
  index: number;
  kind: FlowKind;
}

export interface ViewNode {
  actions: string[];
  id: string;
  accessibilityId: string;
  activity: string;
  type: string;
  positionInParent: number;
  description: string;
  text: string;
  box: Box;
  children?: ViewNode[];
}

export interface Box {
  left: number;
  top: number;
  width: number;
  height: number;
}

// A compare function returns a number between 0 and 1
export type CompareFn = (node1: ViewNode, node2: ViewNode) => number;

export type IndexMatch = Record<number, number>;

export interface ScoredMatch {
  match: IndexMatch;
  score: number;
}

export type NodeTree = Record<number, ViewNode>;

export interface ReversedNode extends ViewNode {
  parent?: ReversedNode;
}

export type LeafNode = Omit<ReversedNode, "children">;

// Key is the color value ([0, 255]), value is the count of occurences
export type ColorHistogram = Record<number, number>;
