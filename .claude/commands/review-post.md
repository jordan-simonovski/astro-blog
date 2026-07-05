---
description: Review a blog post for slop and craft using the content-editor skill in a sub-agent
argument-hint: "[path/to/post.md] (defaults to changed .md files under src/content/blog)"
---

Run the `content-editor` review (in `./review/`) over a blog post, in a
sub-agent so the rubric and full-piece read stay out of this conversation.

Target: `$ARGUMENTS`
If empty, use the added/modified `.md` files under `src/content/blog/` from
`git diff --name-only HEAD` (and untracked ones from `git status`). If there's
still nothing, ask which file to review.

Dispatch the review with the `Agent` tool (`general-purpose`, run
synchronously) using this instruction:

> Read `review/SKILL.md` and its four rubric files — `review/JUDGEMENT.md`,
> `review/TROPES.md`, `review/CRAFT.md`, and `review/FLOW.md` — then follow the
> content-editor procedure to review the target(s) below. Run every pass the
> skill defines, including the flow pass (FLOW.md): state the through-line in one
> sentence at the top of the report and flag orphan paragraphs, reader-reconstructed
> transitions, and overloaded paragraphs. For an explicit file path, review the
> whole file. For git-derived changes, review only added/modified prose. Produce
> the two-section output the skill defines (review report, then inline diffs) and
> return it verbatim.
>
> Targets: <resolved targets>

When the sub-agent returns, show the author the review report and the inline
diffs unchanged. Do not apply anything. If the author names which diffs to
accept, apply only those.
