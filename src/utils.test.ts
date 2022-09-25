import { IndexMatch } from "./types";
import {
  allMatches,
  copySplice,
  findLeafNodes,
  permutations,
  readStep,
} from "./utils";

describe("copySplice", () => {
  test("non destructive", () => {
    const arr = [1, 2, 3, 4];
    const arr2 = copySplice(arr, 2);
    expect(arr2).toEqual([1, 2, 4]);
    expect(arr).toEqual([1, 2, 3, 4]);
  });
});

describe("permutations", () => {
  const data: { a: number[]; len: number; exp: number[][] }[] = [
    { a: [1], len: 1, exp: [[1]] },
    { a: [1, 2], len: 1, exp: [[1], [2]] },
    {
      a: [1, 2],
      len: 2,
      exp: [
        [1, 2],
        [2, 1],
      ],
    },
    {
      a: [1, 2, 3],
      len: 2,
      exp: [
        [1, 2],
        [1, 3],
        [2, 1],
        [2, 3],
        [3, 2],
        [3, 1],
      ],
    },
  ];

  data.forEach(({ a, len, exp }, idx) => {
    test(`${idx}`, () => {
      expect(permutations(a, len).sort()).toEqual(exp.sort());
    });
  });
});

describe("allMatches", () => {
  const data: { i1: number[]; i2: number[]; exp: IndexMatch[] }[] = [
    {
      i1: [1],
      i2: [2],
      exp: [{ 1: 2 }],
    },
    {
      i1: [1, 3],
      i2: [4],
      exp: [{ 1: 4 }, { 3: 4 }],
    },
    {
      i1: [1, 3],
      i2: [2, 4],
      exp: [
        { 1: 2, 3: 4 },
        { 1: 4, 3: 2 },
      ],
    },
  ];

  data.forEach(({ i1, i2, exp }, i) => {
    test(`${i}`, () => {
      expect(allMatches(i1, i2)).toStrictEqual(exp);
    });
  });
});

describe("findLeafNodes", () => {
  test("1", () => {
    const tree = readStep("base", 0);
    const leaves = findLeafNodes(tree.root);

    expect(leaves.length).toEqual(4);

    expect(leaves[0].description).toEqual("android.widget.ImageView @ 0");
    expect(leaves[1].text).toEqual("You don't have any todos");

    let parent = leaves[0].parent;
    while (parent.parent) parent = parent.parent;

    expect(parent).toEqual(tree.root);
  });
});
