import { IndexMatch, ViewNode } from "../types";
import { removeEqualMatches, toTree } from "./match";

const VIEW_NODE: ViewNode = {
  actions: [],
  id: "com.avjindersinghsekhon.minimaltodo:id/title",
  accessibilityId: "",
  activity: "MainActivity",
  type: "android.widget.TextView",
  positionInParent: 0,
  description:
    "android.widget.TextView @ com.avjindersinghsekhon.minimaltodo:id/title",
  box: {
    left: 528,
    top: 123,
    width: 492,
    height: 65,
  },
  text: "New Todo",
};

describe("removeEqualMatches", () => {
  const data: {
    name: string;
    ns: { n1: ViewNode[]; n2: (n: ViewNode[]) => ViewNode[] };
    expected: { m: IndexMatch; n1: number[]; n2: number[] };
  }[] = [
    {
      name: "identical",
      ns: {
        n1: [{ ...VIEW_NODE }, { ...VIEW_NODE, text: "hello" }],
        n2: (n: ViewNode[]) => [...n],
      },
      expected: {
        m: { 0: 0, 1: 1 },
        n1: [],
        n2: [],
      },
    },
    {
      name: "added end",
      ns: {
        n1: [{ ...VIEW_NODE }, { ...VIEW_NODE, text: "hello" }],
        n2: (n: ViewNode[]) => [...n, { ...VIEW_NODE, text: "bla" }],
      },
      expected: {
        m: { 0: 0, 1: 1 },
        n1: [],
        n2: [2],
      },
    },
    {
      name: "added middle",
      ns: {
        n1: [{ ...VIEW_NODE }, { ...VIEW_NODE, text: "hello" }],
        n2: (n: ViewNode[]) => [
          { ...n[0] },
          { ...VIEW_NODE, text: "bla" },
          { ...n[1] },
        ],
      },
      expected: {
        m: { 0: 0, 1: 2 },
        n1: [],
        n2: [1],
      },
    },

    {
      name: "remove",
      ns: {
        n1: [
          { ...VIEW_NODE },
          { ...VIEW_NODE, text: "hello" },
          { ...VIEW_NODE, text: "bla" },
        ],
        n2: (n: ViewNode[]) => [{ ...n[0] }, { ...n[2] }],
      },
      expected: {
        m: { 0: 0, 2: 1 },
        n1: [1],
        n2: [],
      },
    },
  ];

  data.forEach((d) => {
    test(d.name, () => {
      const n2 = d.ns.n2(d.ns.n1);
      const nodes1 = toTree(d.ns.n1);
      const nodes2 = toTree(n2);

      const matches = removeEqualMatches(nodes1, nodes2);

      expect(matches).toStrictEqual(d.expected.m);

      const toNT = (ns: number[], nodes: ViewNode[]) =>
        Object.assign({}, ...ns.map((x) => ({ [x]: nodes[x] })));

      expect(nodes1).toStrictEqual(toNT(d.expected.n1, d.ns.n1));
      expect(nodes2).toStrictEqual(toNT(d.expected.n2, n2));
    });
  });
});
