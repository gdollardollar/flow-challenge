import { CompareFn, ViewNode } from "../types";

export function boolComparator(key: keyof ViewNode): CompareFn {
  return (node1: ViewNode, node2: ViewNode) => {
    const val = node1[key];
    return val && val == node2[key] ? 1 : 0;
  };
}

export function nodeEquals(node1: ViewNode, node2: ViewNode): boolean {
  // Check equality on basic attributes
  // Ignore boxes because they could be located on different position and / or
  // have different sizes
  if (
    node1.id != node2.id ||
    node1.type != node2.type ||
    node1.text != node2.text
  ) {
    return false;
  }

  // Check children
  if (node1.children && node2.children) {
    if (node1.children.length != node2.children.length) {
      return false;
    }

    for (let i = 0; i < node1.children.length; i++) {
      if (!nodeEquals(node1.children[i], node2.children[i])) {
        return false;
      }
    }
  } else if (node1.children || node2.children) {
    // one of them has children but the other one does not
    return false;
  }

  return true;
}
