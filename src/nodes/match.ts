import { IndexMatch, NodeTree, ViewNode } from "../types";
import { nodeEquals } from "./compare";

// Utils function because ts insists on setting keys as strings
// Also if we need to preserve order we could do it in here
function enumerate(
  tree: NodeTree,
  fn: (v: ViewNode, idx: number) => boolean | void
) {
  Object.entries(tree).forEach(([k, v]) => {
    if (fn(v, parseInt(k))) {
      return;
    }
  });
}

export function toTree(nodes: ViewNode[]) {
  const out: NodeTree = {};
  nodes.forEach((n, idx) => {
    out[idx] = n;
  });
  return out;
}

// node1 and node2 arrays are modified in place, matches are removed
export function removeEqualMatches(
  nodes1: NodeTree,
  nodes2: NodeTree
): IndexMatch {
  const match: IndexMatch = {};

  enumerate(nodes1, (n1, i) => {
    enumerate(nodes2, (n2, j) => {
      if (nodeEquals(n1, n2)) {
        match[i] = j;
        delete nodes1[i];
        delete nodes2[j];
        return true;
      }
    });
  });

  return match;
}

// function matchNodes(nodes1: ViewNode[], nodes2: ViewNode[]): IndexMatch {
//   // Copy arrays
//   const nodes1Rec = toTree(nodes1);
//   const nodes2Rec = toTree(nodes2);

//   const matches = RemoveEqualMatches(nodes1Rec, nodes2Rec);

//   return matches;
// }
