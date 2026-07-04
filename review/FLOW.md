# Flow

The narrative layer. Craft judges sentences and paragraphs one at a time; flow
judges whether the piece holds together as a path the reader can walk. It owns
the paragraph-and-above altitude: through-line, paragraph purpose, transitions,
and how much each paragraph asks the reader to hold. Below the paragraph, it
yields to craft.

The one test, applied to everything in this file: can a competent reader follow
the path on one read. Not "is this dense". Dense prose that a careful reader
can follow in one pass is fine, and for this author it is usually deliberate.
Never use readability or grade-level scores; they penalise technical writing
and push toward dumbing down. A sentence full of ClickHouse internals scoring
"college graduate" is not a finding.

## Two failure modes

People conflate these, but they are opposites, and the fix differs. Every flow
flag must name which one it is.

Word vomit: unedited overflow. Low signal per word, points restated, tangents
that never rejoin the argument, no through-line pulling the reader forward.
The reader loses the path because there is too much that is not path.
The fix is to cut.

Over-compression: so much packed so tightly that the reader loses the thread.
Steps of the argument skipped, three ideas fused into one sentence, a
conclusion that arrives before the reader has the pieces to accept it. The
reader loses the path because the path has gaps.
The fix is to unpack: restore the missing step or split the load. It is never
to pad. An unpack that adds throat-clearing, hedges, or a "let's break this
down" is a bad fix. Add the missing idea, not more words around the existing
ones.

Compression alone is never the finding. This author writes compressed and
deadpan on purpose; tight prose is a feature. Flag over-compression only when
a competent reader, reading once, would have to stop and reconstruct something
the text should have carried. When compression is characteristic rather than
confusing, it passes, and say nothing.

## What to check

Run these in order. The through-line comes first because the other checks are
judged against it.

1. Through-line. State the post's through-line in one sentence: the single
   path the piece walks from opening to close. If you cannot state it, the
   spine is missing; that is the finding, and it outranks everything else in
   this file. Report the through-line (or its absence) at the top of the flow
   findings so the author can check your reading against their intent. If your
   sentence and their intent differ, the piece has a flow problem even if
   every paragraph reads well locally.

2. Orphan blocks. Flag any paragraph that does not advance the through-line.
   A paragraph can advance it by moving the argument, setting up a move, or
   paying one off. A good joke or aside that costs one sentence is voice, not
   an orphan. A paragraph of context the argument never uses is an orphan
   even if it is well written. Name what the paragraph would need to do to
   earn its place, or propose the cut.

3. Transitions. Flag any junction where the reader has to reconstruct the
   logical connection between one paragraph and the next themselves. The test
   is whether the connection is in the text, not whether a connective phrase
   is present; two paragraphs can join cleanly with no signpost at all, and a
   "however" can sit on top of a non sequitur. Suggest the connective idea.
   Never suggest a filler phrase, and never one of the slop transitions.

4. Load. Flag any paragraph carrying too many distinct ideas to hold at once.
   Count the ideas and name them; that count is the evidence. This is usually
   the over-compression mode. The fix is to split or resequence, not to
   explain each idea at greater length.

For each flag from checks 2 through 4, state which failure mode it is, word
vomit or over-compression, and give the matching fix. Do not flag a paragraph
under both modes; pick the one that describes why the reader loses the path.

## Output discipline

Every finding cites the specific paragraph or transition (by line reference,
like the other layers), names the failure mode, and gives the concrete fix: a
proposed cut, a proposed split, or the missing connective idea stated in one
sentence. Vague verdicts are banned. "The flow could be tightened" is not a
finding. "The middle section drags" is not a finding without the paragraphs
that make it drag and what to do with them.

If a section reads well, say nothing about it. Flow findings are not a tour of
the piece; they are a list of places the reader falls off the path. A clean
piece produces one line: the through-line, and no flags.

Severity: flow findings file as craft or note, never slop. They are judgment
calls the author may reject, same certainty class as the rest of the craft
layer. Tag the category as flow so they are distinguishable in the report.

## How flow interacts with craft and voice

Flow owns the paragraph-and-above altitude; craft owns the sentence and below.
When the two would give conflicting advice about the same text, tighten versus
unpack, the altitude decides: if the problem is that the reader loses the
thread across a paragraph or a junction, flow's advice wins; if the problem is
inside a single sentence, craft's advice wins. Do not file the same text under
both layers. Weak transitions belong to flow, not craft.

Voice beats flow, same as it beats craft. Deliberate fragments, deadpan
asides, hard cuts that land: these are the author's register, not navigation
failures. The only voice-adjacent thing flow may flag is the case where a
characteristic move stops landing because the reader no longer has the
context to get it. Flag that as over-compression on the missing context, not
as a problem with the move.
