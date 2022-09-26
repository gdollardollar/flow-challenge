import { compareHistograms, computeHistograms } from ".";

describe("compare", () => {
  test("same", async () => {
    const { red, green, blue } = await computeHistograms("head", 0);

    expect(compareHistograms(red, red)).toEqual(1);
    expect(compareHistograms(green, green)).toEqual(1);
    expect(compareHistograms(blue, blue)).toEqual(1);
  });

  test("different", async () => {
    const { red: r1 } = await computeHistograms("head", 0);
    const { red: r2 } = await computeHistograms("head", 4);

    expect(compareHistograms(r1, r2)).toBeLessThan(1);
    expect(compareHistograms(r1, r2)).toBeGreaterThan(0);
  });
});
