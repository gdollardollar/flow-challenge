# Flow challenge

This challenge offers a good insight into one of the core problems we solve at Waldo: how to 
properly match together different screens and user journeys in a mobile app.

## Submit

Please zip your work once it's complete and send it to developers@waldo.com.

## The goal

You are given the results from the extraction of different flows, on 2 different versions of an app,
that we called `base` and `head`.
A flow is a sequence of user interactions that start from an app open, and where each step is the 
result of a user tap on the previous step.

An extraction is formatted like this:
- `flows.json`: the collection of flows, each defining a sequence of steps, from `start` to `end`.
- 3 representations for each step
  * `xml/step-{step}.xml` is the xml structure as retrieved from Android. It represents the elements on screen.
  * `json/step-{step}.json` is the normalization of this xml structure into our proprietary structure.
One thing to notice is that it includes the activity name (in the Android sense) which rendered this screen.
  * `png/step-{step}.png` is the snapshot of the device screen at the time.

For instance, `head/png/step-1.png` is the second step of the `Flow #1` and was obtained after the
user tapped on the 3 dots on `head/png/step-0.png` (no need to look for it, the information about 
the tap is not captured in the results and is not relevant to the problem here).

| head.step-0      | head.step-1                                                         |
|-----------|---------------------------------------------------------------------|
| <img src="data/head/png/step-0.png" alt="head.step-0" width="200"/>    | <img src="data/head/png/step-1.png" alt="head.step-1" width="200"/> |

Your goal is to best match the steps of each flow from `base` and `head`, while preserving their order.
For instance, for the `Flow #1`, this is a correct mapping:
```
base.step-0 <-> head.step-0
base.step-1 <-> head.step-1
base.step-2 <-> head.step-2
base.step-3 <-> head.step-3
base.step-4 <-> head.step-4
```

This is also a correct mapping:
```
base.step-0 <-> head.step-0
base.step-1 <-> head.step-2
base.step-2 <-> head.step-3
base.step-4 <-> head.step-4
```

but this is not a correct mapping:
```
base.step-0 <-> head.step-0
base.step-1 <-> head.step-2
base.step-2 <-> head.step-1
base.step-3 <-> head.step-3
base.step-4 <-> head.step-4
```
because the steps of head are not in an increasing order.

## Guidelines

This is purposefully a pretty open-ended problem, and most certainly one that you could spend way 
more than a few hours on.

This should not scare you, we're not trying to set you up for failure here. Instead, we're very 
interested in how you **approach** this problem.

That being said, we want to **see** some things in your submission. So we strongly encourage you to 
start small but try to get deliverables along the way. You should not care about code quality, it 
does not matter, be scrappy and explore!

And there's a good chance that it brings a ton of ideas to mind. Please share them with us, we 
recommend that you spend ~30 minutes capturing your thoughts in a quick doc before submitting to us.

Good luck, and have fun!
