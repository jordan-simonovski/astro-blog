---
name: content-editor
description: >-
  Review and improve blog post and article prose. Checks for "AI slop" against a
  curated tropes rubric AND for general writing quality: clarity, structure,
  mechanics, argument, and concision. Proposes concrete edits that preserve the
  author's voice. Use this skill whenever the user asks to review, edit, improve,
  tighten, deslopify, proofread, or voice-check Markdown content for a blog or
  article, AND whenever an automation or CI run asks to check added or modified
  Markdown files in a diff or pull request. Trigger on phrases like "review my
  post", "improve this draft", "make this better", "check this for slop",
  "deslopify", "voice check", "is this too AI", "tighten this up", or any agentic
  run that passes Markdown content or changed .md files for prose review. Do not
  trigger for code review, commit messages, or non-prose content.
---

# Content Editor

Reviews and improves prose in Markdown content, then proposes edits. It works in
two layers: a slop check against a tropes rubric, and a craft check for clarity,
mechanics, argument, and concision. It flags and suggests, never auto-applies,
and protects the author's voice as a hard constraint above both layers.

## What this skill does and does not do

It produces two things: a Markdown review report, and inline diffs of proposed
edits. It suggests; the author approves and applies. It never edits files in
place, never rewrites for taste beyond removing flagged tropes, and never
touches the author's voice markers.

## Inputs

This skill handles two modes. Detect which applies from how it was invoked.

Manual mode: the user pastes or points at one or more Markdown files and asks
for a review. Review the whole content of each file.

Automation mode: a CI step or agent run passes a diff, a PR, or a list of
added/modified `.md` paths. Review only the prose that was added or changed in
the diff. Do not review unchanged lines. If you are given a diff, restrict
flags to lines in the additions.

If no files or content are provided, ask which file to review rather than
guessing.

## Procedure

1. Read `review/judgment-rules.md`. This governs scope, the density rule,
   and voice preservation. Apply it strictly. It overrides any instinct to flag
   casual or opinionated prose.

2. Read `review/tropes.md` (the slop pattern catalogue) and
   `review/craft.md` (the good-writing layer and the voice profile). The
   craft file defines severity levels and the rule that voice beats craft advice
   whenever they conflict. Both are mirrored locally so you never depend on a
   live fetch. If the user says the upstream tropes list at tropes.fyi has
   changed, offer to re-sync tropes.md, but default to the local copy.

3. For each file or diff, strip out non-prose per the scope rules (code fences,
   inline code, frontmatter, quoted source blocks, URLs, alt text, HTML, config
   and log output). Assess only prose.

4. Slop pass. Identify trope occurrences. For each, record the line, the
   offending text, which trope it matches, and whether it clears the density bar.
   Apply the high-signal exceptions: some tells are flaggable even once.

5. Craft pass. Work through clarity and structure, mechanics, argument quality,
   and concision per craft.md. Assign each finding a severity (craft or note,
   never slop). Mechanics errors are firm; structure and argument notes are
   suggestions the author decides on.

6. Voice pass. Separate genuine issues from the author's deliberate voice using
   the voice profile in craft.md. When something has the shape of a trope or a
   craft weakness but is doing real work and lands, note it and leave it. Flag
   drift away from the voice profile toward flatter or more corporate prose as a
   craft note.

7. For every flagged item in either pass, write a concrete proposed edit that
   fixes the issue while keeping meaning, register, and voice. Never blandify. If
   a flagged line carries a joke or an opinion, the rewrite keeps it. Do not
   double-count a line under both slop and craft; if it matches a trope, file it
   under slop.

## Output format

Produce both sections, in this order.

### Section 1: Review report

A Markdown report. Start with a one-line verdict per file: clean, minor, or
needs work, with the count of items at each severity (slop, craft, note). Then
list each item as a short entry with the line reference, a severity tag, the
category or trope name, the original text, and a one-sentence reason. Order
within a file by line number, not by severity, so it reads as a pass through the
piece. Group by file when there is more than one. Do not pad with summaries of
summaries. No "in conclusion".

Keep the report itself free of the tropes it polices. Write it plainly: no em
dashes, no bold-first bullets, no signposted conclusion. The report is also
subject to the rubric; do not become the thing you are checking for.

### Section 2: Inline diffs

For each flagged item, show a unified-diff-style block: the original line
prefixed with `-` and the proposed replacement prefixed with `+`. One block per
edit so the author can accept or reject individually. Reference the line number
above each block.

End by stating that nothing has been applied and the author should pick which
diffs to take. Do not apply edits, do not write to the source file, and do not
offer to auto-fix. If the author then says which diffs to accept, apply only
those.

## Hard constraints

- Suggest only. Never modify the source file without explicit per-edit approval.
- Voice beats craft. When a good-writing suggestion would erode the author's
  voice, drop the suggestion. Voice markers (profanity, dry humour, parenthetical
  asides, strong opinions, deliberate fragments, casual register) are never
  flagged.
- Keep the layers honest about certainty. Slop flags are firm. Craft and note
  items are the author's call; present them as options, not verdicts.
- Density governs the slop pass. One instance of most tropes is fine. Cite counts
  for the high-signal tells.
- In automation mode, flag only added or modified lines.
- Reports and rewrites must not themselves contain the tropes being policed.