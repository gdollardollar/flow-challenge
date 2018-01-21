# Flow challenge

This repository is a challenge to solve flows comparison.

## Content

This repo contains 2 folders, `base` and `head`, which correspond to the explorations of 2 versions of the same app.
Each folder consists of:
- `flows.json` which represents a collection of flows, each defining a sequence of steps, from `start` to `end`.
- 3 representations for each step
  * `step-{step}-original-tree.xml` is the xml structure as retrieved directly from Android. It represents the elements on screen.
  * `step-{step}-tree.json` is the normalization of this xml structure into our proprietary structure.
One thing to notice is that it includes the activity name (in the Android sense) which displayed this screen.
  * `step-{step}-screen.png` is the snapshot of the device screen at the time.

In short, this means that during the exploration, we started a flow at step `start`, we triggered some interaction which led to `start + 1` 
and we considered the flow to be terminated at the step `end`, at which point we started exploring another flow.

## Goals

Given this data, the broad goal is to compare the 2 versions of the app, `head` versus `base`.

The first 3 flows are the same in `head` and `base`, which means that you can directly do screen-for-screen comparisons.

However the other flows are not ordered, and some are missing either from `head` or `base`.

Potential things to aim for:
- analyze the difference between 2 screens:

**appearance change**: the screen is looking different at a given step, but is structurally the same (e.g. one icon has been added, etc..)

**behavioral change**: the flow is different in its functionality, e.g. it does not follow the same sequence of screens
(e.g. flow A goes from list view to detail view at step 1 vs. flow B remains on list view at step 1)

- match flows from `head` with the corresponding flows from `base`.

These goals are flexible, and you should consider the problem open. Keep in mind though that what we want to do is delivering, 
in the most meaningful and least noisy way, the UI and UX differences that are introduced by a new version of an app.
