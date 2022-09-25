import { range } from "lodash";

import type { CompareFn, IndexMatch, ScoredMatch, ViewNode } from "../types";
import { allMatches } from "../utils";
import { boolComparator } from "./compare";

// Total adds up to 100
const NODE_COMPARATORS: [CompareFn, number][] = [
  [boolComparator("id"), 30],
  [boolComparator("accessibilityId"), 30],
  [boolComparator("type"), 10],
  [boolComparator("text"), 30],
];

export function compareNodes(n1: ViewNode, n2: ViewNode): number {
  return NODE_COMPARATORS.reduce((score, [fn, weight]) => {
    return score + weight * fn(n1, n2);
  }, 0);
}

export function computeScore(n1s: ViewNode[], n2s: ViewNode[], m: IndexMatch) {
  const score = n1s.reduce((score, n1, i) => {
    const j = m[i];
    if (j === undefined) {
      return score;
    }
    return score + compareNodes(n1, n2s[j]);
  }, 0);
  // Normalize the score by the number of elements
  return score / Object.keys(m).length;
}

export function findBestMatch(n1s: ViewNode[], n2s: ViewNode[]): ScoredMatch {
  const possibles = allMatches(range(n1s.length), range(n2s.length));

  return possibles.reduce(
    (sm, match) => {
      const score = computeScore(n1s, n2s, match);
      return score > sm.score ? { match, score } : sm;
    },
    { match: {}, score: 0 } as ScoredMatch
  );
}
