import { readFileSync } from "fs";
import { join } from "path";

import { range } from "lodash";

import type {
  Flow,
  IndexMatch,
  LeafNode,
  ReversedNode,
  Step,
  ViewNode,
} from "./types";

export type FlowKind = "base" | "head";

export function readJSON(path: string) {
  const content = readFileSync(path, "utf-8");
  return JSON.parse(content);
}

export function readFlows(kind: FlowKind): Flow[] {
  return (
    readJSON(join(__dirname, `../data/${kind}/flows.json`)) as Omit<
      Flow,
      "kind"
    >[]
  ).map((v) => ({
    ...v,
    kind,
  }));
}

export function readStep(kind: FlowKind, index: number): Step {
  return {
    ...readJSON(join(__dirname, `../data/${kind}/json/step-${index}.json`)),
    index,
  };
}

export function copySplice<T>(arr: T[], i: number) {
  return [...arr.slice(0, i), ...arr.slice(i + 1)];
}

// This is a pretty unefficient implementation, since we copy arrays a bunch
// We could probably improve a lot by implementing an actual algorithm
// https://stackoverflow.com/questions/12935194/permutations-between-two-lists-of-unequal-length
export function permutations<T>(array: T[], len: number) {
  if (len == 1) {
    return array.map((k) => [k]);
  }

  const out: T[][] = [];
  array.forEach((k, idx) => {
    const ps = permutations(copySplice(array, idx), len - 1);
    ps.forEach((p) => {
      out.push([k, ...p]);
    });
  });
  return out;
}

function combine(keys: number[], values: number[]) {
  const out: IndexMatch = {};
  for (let i = 0; i < keys.length; i++) {
    out[keys[i]] = values[i];
  }
  return out;
}

export function allMatches(indices1: number[], indices2: number[]) {
  if (indices1.length > indices2.length) {
    const ps = permutations(indices1, indices2.length);
    return ps.map((p) => combine(p, indices2));
  }

  const ps2 = permutations(indices2, indices1.length);
  return ps2.map((p) => combine(indices1, p));
}

export function findLeafNodes(tree: ViewNode) {
  const out: LeafNode[] = [];

  for (const child of tree.children) {
    (child as ReversedNode).parent = tree;

    if (child.children) {
      out.push(...findLeafNodes(child));
    } else {
      out.push(child);
    }
  }

  return out;
}

export function flowSteps(flow: Flow): Step[] {
  return range(flow.start, flow.end + 1).map((i) => readStep(flow.kind, i));
}
