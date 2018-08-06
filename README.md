# Flow challenge

This repository consists of 2 challenges to approach flows comparison.

In both challenges, the goal is to compare 2 versions `head` and `base` of the same app against each other.

It's up to you on how you want to present the results, but we are specifically interested by the algorithmic approach.

## Submit

Please add @laurentsigal as a contributor to your github repository.
Otherwise you can simply host the code anywhere and give us a link to the zip file.
Do not make your repository public.

## Challenges structure

Both challenges follow the same structure.
They contain 2 subfolders `head` and `base`, each corresponding to the outcome of running a different version of the app.
Each subfolder contains:

- `flows.json` which represents a collection of flows, each defining a sequence of steps, from `start` to `end`.
- 3 representations for each step
  * `xml/step-{step}.xml` is the xml structure as retrieved from Android. It represents the elements on screen.
  * `json/step-{step}.json` is the normalization of this xml structure into our proprietary structure.
One thing to notice is that it includes the activity name (in the Android sense) which rendered this screen.
  * `png/step-{step}.png` is the snapshot of the device screen at the time.

## Challenge #1: Matched flows

In the first challenge `challenge-1-matched-flows`, the datasets are clean.
The flows in `head` and `base` match.
However, as you can notice, the flows #3 and #4 do not match in length in both versions.

**Things to look for**
- Analyze the differences between screens, in the most "intelligible" way
- Align screens that match for flows with different lengths

## Challenge #2: Fuzzy match

In the second challenge `challenge-2-fuzzy-match`, the dataset is way messier.

Most flows (with names `Flow ??`) are unordered, i.e the flow at position 4 in `head` might match with any
other flow from `base`. It might not even have a corresponding flow in `base`.
Moreover, some steps did not complete properly, e.g. some screens are not "functionally" matching from `base` compared to `head`.
An example is the `step-2`, which was not reached properly in `head`.

**Things to look for**
- find a way to still match flows one with another

An approach can be to compute the likelihood that 2 flows are in fact representing the same functionality.
