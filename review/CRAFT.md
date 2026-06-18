# Craft

The good-writing layer. This is separate from the slop rubric and operates at a
lower severity. Slop tropes are violations: mechanical, high-agreement, worth
flagging. Craft notes are observations: judgment calls the author may reasonably
reject. Raise them, do not insist on them.

The ordering that matters: when craft advice conflicts with the author's voice,
voice wins, every time. A flabby sentence that carries a joke stays. A fragment
that lands stays. Do not improve prose toward a generic ideal. Improve it toward
the best version of the author's own writing.

## Severity

Use three levels in the report:
- slop: a trope from the rubric that cleared the density bar. Worth removing.
- craft: a real weakness in clarity, mechanics, argument, or concision. Worth
  considering. The author decides.
- note: a smaller observation or an alternative worth seeing, no strong claim
  that the original is wrong.

Never present a craft note with the certainty of a slop flag. "This buries the
point" is a craft note, not a verdict.

## What to check

### Clarity and structure
- Buried lede: the most interesting sentence is in paragraph four. Flag it and
  say where it might move.
- Weak opening: the first line is throat-clearing or context-setting that delays
  the actual hook. Note what the real opening might be.
- Flabby sentences: a sentence that takes thirty words to do ten words of work.
  Propose the tighter version, but keep any deliberate looseness that sets rhythm
  or tone.
- Orphaned setup: a thing introduced and never paid off, or a payoff with no
  setup.

### Mechanics
- Grammar and agreement errors. These are real, flag them plainly.
- Unintentional word repetition: the same distinctive word three times in a
  paragraph when it was not for effect. The earlier espresso review caught a
  doubled "jump/jumping" and a stacked "and ... and ... and"; that is the kind
  of thing to catch. Deliberate repetition for emphasis is voice, not error.
- Awkward phrasing and garbled word order: the earlier review flagged a sentence
  whose clauses were in the wrong order ("hopefully ends up in an OLAP you can
  use to munge the data like ClickHouse or Honeycomb"). Untangle these.
- Mixed or broken constructions: a sentence that starts one grammatical shape
  and finishes another.

### Argument quality
- Unsupported claims: an assertion that wants a reason, a number, or an example
  and does not have one. Note where the support is missing. Do not invent it.
- Weak transitions: two paragraphs that sit next to each other without the logic
  between them being clear. Suggest the connective idea, not a filler phrase
  (and never one of the slop transitions like "It's worth noting").
- Logical gaps: a conclusion that does not follow from what came before.
- Hand-waving: a hard part of the argument skipped with "obviously" or
  "clearly". For a technical audience, the hard part is usually the interesting
  part. Point at it.

### Concision
- Cuttable words: qualifiers, hedges, and throat-clearing that add nothing
  ("basically", "essentially", "in order to", "the fact that"). Propose the cut.
- Redundancy: saying the same thing twice in one sentence or across two adjacent
  ones.
- Restating the thesis: a paragraph that re-explains a point already made. Note
  it, but distinguish a deliberate callback from accidental repetition.

Concision is a tool, not a god. Some of the author's best lines earn their
length. Cut waste, not personality.

## Voice profile

The author's established markers, to be preserved and used as the consistency
baseline. These are NEVER flagged, and a craft suggestion that erodes one is a
bad suggestion.

- Dry, deadpan asides and self-deprecation ("the most patient I have ever been
  about anything"; "Mine. It's always the grind.").
- Profanity, used deliberately ("Instrument your shit with intent").
- Parenthetical asides, including mid-sentence qualifiers ("(arguably)").
- Embedded-systems and ops gallows humour, meme register where it lands ("STOP
  DOING FIRMWARE", Hank Hill).
- Strong opinions stated flatly, with no hedging and no apology (e.g. about bad
  semantic conventions).
- Technical precision held to a high bar: percentiles over averages, traces over
  guesswork, real numbers over vague claims.
- Plain straight-typed Markdown: straight quotes, no em dashes, no curly
  punctuation, no unicode decoration.

Use this profile two ways. First, never flag these as problems. Second, when the
prose drifts away from this register toward something flatter or more corporate,
that drift is itself a craft note: "this paragraph reads more generic than your
usual voice."

## How craft interacts with the slop rubric

Some craft issues and slop tropes overlap (a flabby sentence may also be
one-point dilution; a weak transition may tempt a slop filler phrase). When they
overlap, name it once, under slop if it matches a trope, otherwise under craft.
Do not double-count the same line in both sections.