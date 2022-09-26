import { join } from "path";

import { read, intToRGBA, RESIZE_NEAREST_NEIGHBOR } from "jimp";

import { ColorHistogram, FlowKind, Step } from "../types";
import { dataDirectory } from "../utils";

export function addToHistogram(h: ColorHistogram, v: number) {
  h[v] = (h[v] ?? 0) + 1;
}

const RESIZE_TO = 300;
const NB_PIXELS = RESIZE_TO * RESIZE_TO;

// We compute histograms on a lower quality image
// Check https://stackoverflow.com/questions/25977/how-can-i-measure-the-similarity-between-two-images
// For a better approach ?
export async function computeHistograms(kind: FlowKind, index: number) {
  // let start = Date.now();
  // console.debug("Reading");

  // TODO: we load the entire image in memory which is not needed
  let img = await read(join(dataDirectory(), `${kind}/png/step-${index}.png`));
  img = img.resize(RESIZE_TO, RESIZE_TO, RESIZE_NEAREST_NEIGHBOR);

  // console.debug(`Done reading after: ${Date.now() - start}ms`);
  // start = Date.now();
  const h = img.getHeight();
  const w = img.getWidth();

  // TODO: Should we deal with opacity too ?
  const red: ColorHistogram = {};
  const green: ColorHistogram = {};
  const blue: ColorHistogram = {};

  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      const color = intToRGBA(img.getPixelColor(x, y));
      addToHistogram(red, color.r);
      addToHistogram(blue, color.b);
      addToHistogram(green, color.g);
    }
  }

  // console.debug(`Done computing: ${Date.now() - start}ms`);

  return { red, green, blue };
}

// Calculates a distance between histograms between 0 and 1
// 1 meaning they are the same
export function compareHistograms(h1: ColorHistogram, h2: ColorHistogram) {
  const keys = new Set([...Object.keys(h1), ...Object.keys(h2)].map(Number));

  let distance = 0;
  keys.forEach((k) => {
    distance += Math.abs((h1[k] ?? 0) - (h2[k] ?? 0));
  });

  return 1 - distance / (2 * NB_PIXELS);
}

export async function compareStepImages(s1: Step, s2: Step) {
  const h1 = await computeHistograms(s1.kind, s1.index);
  const h2 = await computeHistograms(s2.kind, s2.index);

  return (
    (compareHistograms(h1.red, h2.red) +
      compareHistograms(h1.blue, h2.blue) +
      compareHistograms(h1.green, h2.green)) /
    3
  );
}
