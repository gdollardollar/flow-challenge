import { findLeafNodes, readStep } from "../utils";
import { smarterScoring } from "./scores";

test("extractbestMatch", () => {
  const ns1 = findLeafNodes(readStep("base", 0).root);
  const ns2 = findLeafNodes(readStep("head", 2).root);

  console.log(
    ns1.map((k) => k.text),
    ns2.map((k) => k.text)
  );

  smarterScoring(ns1, ns2);

  console.log(
    ns1.map((k) => k.text),
    ns2.map((k) => k.text)
  );
});
