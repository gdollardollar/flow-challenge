import { compareStepImages } from "./images";
import { findBestMatch } from "./nodes/scores";
import { Flow, IndexMatch, Step } from "./types";
import { findLeafNodes, flowSteps, readFlows } from "./utils";

async function compareSteps(s1: Step, s2: Step) {
  let { score } = findBestMatch(findLeafNodes(s1.root), findLeafNodes(s2.root));

  score *= 0.4; // nodes account for 40% of total score

  // Matching activity names adds 20%
  // We could also just decide that a different name is an obvious giveway
  // and add a massive penalty. But that would make the algorithm break
  // if the activity name changes for no real reason.
  if (s1.activity == s2.activity) {
    score += 20;
  }

  score += (await compareStepImages(s1, s2)) * 40;

  return score;
}

async function maxScore(step: Step, others: Step[]) {
  const out = { score: 0, idx: -1 };
  for (let j = 0; j < others.length; j++) {
    const score = await compareSteps(step, others[j]);
    if (score > out.score) {
      out.score = score;
      out.idx = j;
    }
  }

  return out;
}

async function findMatch(base: Flow, head: Flow) {
  const baseSteps = flowSteps(base);
  const headSteps = flowSteps(head);

  let baseIdx = 0;
  let headIdx = 0;

  const match: IndexMatch = {};

  while (baseIdx < baseSteps.length && headIdx < headSteps.length) {
    // We find the maximum score of the first element of each array with
    // an element of the other array
    const baseMaxScore = await maxScore(
      baseSteps[baseIdx],
      headSteps.slice(headIdx)
    );
    const headMaxScore = await maxScore(
      headSteps[headIdx],
      baseSteps.slice(baseIdx)
    );

    // TODO: add threshold when there are no good matches ?
    if (baseMaxScore.score > headMaxScore.score) {
      // First element of base steps matched with one element of head
      match[baseIdx] = baseMaxScore.idx + headIdx;
      baseIdx++;
      headIdx += baseMaxScore.idx + 1;
    } else {
      // First element of head matched with one element of base
      match[headMaxScore.idx + baseIdx] = headIdx;
      baseIdx += headMaxScore.idx + 1;
      headIdx++;
    }
  }

  return match;
}

async function main() {
  const base = readFlows("base");
  const head = readFlows("head");

  if (base.length != head.length) {
    throw "Flow base and head do not have same length";
  }

  for (let i = 0; i < base.length; i++) {
    const b = base[i];
    const h = head[i];
    console.log(`------------------------------`);
    console.log(`Finding matches in ${b.name} <-> ${h.name}`);
    console.log(`(Base: ${b.start}/${b.end}, Head: ${h.start}/${h.end})\n`);
    const match = await findMatch(b, h);
    Object.entries(match).forEach(([k, v]) => {
      console.log(`base.step-${k} <-> head.step-${v}`);
    });
    console.log("\n");
  }
}

main();
