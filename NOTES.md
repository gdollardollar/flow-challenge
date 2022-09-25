# Notes

## 1. Why are step-1 and step-0 so different ?

- step 1.json / step 1.xml contains only what is different from the last screen ?

## 2. Can we actually rely on IDs for matching ?

- an ID could easily be renamed or deleted -> naively yes but we need to account for changes =
artificially map / set IDs if no match is found. We also need to account for nesting, an id
in android is scoped to a component...

## 3. Problem is a recursive problem

We need to match steps but also nodes. The problem is similar = nodes can be added or removed.
Main difference is the order constraint that is only on the steps.

## 4. Problem is a scoring problem

Matching needs to be fuzzy.

## 5. Is image analysis relevant ?

If all else matches ? For example, step-4 and step-1 have identical structures but a different background.

We could use a simple image matching algorithm e-g: 
https://stackoverflow.com/questions/25977/how-can-i-measure-the-similarity-between-two-images
to compute a naive score either on the entire screen or boxes.

# 6. Matching nodes

2 approach:
- find nodes matching with certainty and fill in the gaps -> but what if no certainty, that 
would be good for incremental changes = what we have here.
- check all permutations, and get the one with the best score

I think given the context we can assume that there are at least some similarities between the 
two. Computing a diffenrece between two very different screens would not make sense.

# 7. Do we care about the structure ?

Matching a tree of nodes is actually complicated because there are a lot of possible permutations.
Matching leef nodes would be pretty easy in contrast ?

# 8. -> we don't have time

Early optimization is the root of all evil, let's brute force this and see what happens.

# 9. Brute forcing top -> down is too naive

Outputing all possible matches and computing a score is not only sub-obtimal but also
limited to comparing nodes to the same level of depth.

It is very common for developers to introduce layouts in the middle of the
hierarchy that do not modify the overally appearance of the screen.

Now we are back to finding matching patterns in a direct acyclic graph which is a problem
for research and is kind of hard to solve in 5 hours.

# 10. Instead we can try going bottom -> up, comparing leaf nodes

Reversing the graph and comparing leaf nodes should be fairly easy. Plus it makes sense,
because they gather the most important data on the screen.

We could also go up from the leaves to see if the parents match.

# 11. Finding all permutations

The main problem with starting with possible permutations is that we assume
that there will be at least a minimum number of matches (as of now, the minimum of
the two length). Which is not really the case.

-> For nodes, it's ok since we just want to score resemblance. An "extra" match will
just probably result in a low score and not affect the rest.

-> Does a Similar approach work for steps ? Not really because the match itself is the
result. We could have a similar approach and then remove matches with low scores. Seems
overkill for now.

# 12. Moving through steps

A naive approach would iterate through one array and find the best score for its 
elements within the other array. That would not account for "skipped" elements in that
array though.

We can use stacks to check both arrays at once and a threshold to eliminate skipped elments (e-g base-1 and head-1 have no match).

-> No need to use thresholds with the given examples, we did not have to skip a pair of screens.

# 13. Scalability

Checking all permutations of leaf nodes is not really scalable. Example 2, has 6
leaf nodes on one side and 10 on the other, which leads to `151_200`... and that
comparison takes 20 seconds. Given the wide range of screens that is not really
an option.

Multiple ways to scale this:
- consider removing obvious equalities. Removing only one element in flow #2 would
bring the permutation count to `15_120`, removing 2 -> only `336`.
- go up the tree hierarchy. We could group leaf node together to not only limit
the number of permutations but also add meaning. There is no sense comparing
the image associated with "no to-do", but comparing its parent makes sense.

