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
  // const now = Date.now();
  const possibles = allMatches(range(n1s.length), range(n2s.length));
  // console.log("All Matches", Date.now() - now);
  // console.log("Permutations", possibles.length);

  return possibles.reduce(
    (sm, match) => {
      const score = computeScore(n1s, n2s, match);
      return score > sm.score ? { match, score } : sm;
    },
    { match: {}, score: 0 } as ScoredMatch
  );
}

// Finds and removes best match between the 2 node arrays and return the score
export function smarterScoring(n1s: ViewNode[], n2s: ViewNode[]): number {
  const scores = new Array<number>(n1s.length * n2s.length);
  n1s.forEach((n1, i) => {
    n2s.forEach((n2, j) => {
      scores[i * n2s.length + j] = compareNodes(n1, n2);
    });
  });

  const done1 = new Set<number>();
  const done2 = new Set<number>();
  let score = 0;

  while (done1.size < n1s.length && done2.size < n2s.length) {
    const { idx: maxIndex, score: maxScore } = scores.reduce(
      ({ idx, score }, mValue, mIndex) => {
        const i = Math.floor(mIndex / n2s.length);
        const j = mIndex % n2s.length;

        if (done1.has(i) || done2.has(j)) {
          return { idx, score };
        }

        if (score < mValue) {
          return { score: mValue, idx: mIndex };
        }
        return { idx, score };
      },
      { idx: 0, score: -1 }
    );

    const i = Math.floor(maxIndex / n2s.length);
    const j = maxIndex % n2s.length;

    done1.add(i);
    done2.add(j);

    score += maxScore;

    // console.log(
    //   `Matching ${i}/${n1s[i].text} with ${j}/${n2s[j].text}, Score: ${maxScore}\n`
    // );
  }

  return score / done1.size;
}

// export function scoreBestMatches(
//   n1s: ViewNode[],
//   n2s: ViewNode[]
// ): ScoredMatch {
//   while (n1s.length > 0 && n2s.length > 0) {}
//   // const now = Date.now();
//   const possibles = allMatches(range(n1s.length), range(n2s.length));
//   // console.log("All Matches", Date.now() - now);
//   console.log("Permutations", possibles.length);

//   return possibles.reduce(
//     (sm, match) => {
//       const score = computeScore(n1s, n2s, match);
//       return score > sm.score ? { match, score } : sm;
//     },
//     { match: {}, score: 0 } as ScoredMatch
//   );
// }
