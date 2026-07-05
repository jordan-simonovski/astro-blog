# AGENTS.md

Astro blog. Posts live in `src/content/blog/*.md` with frontmatter (`title`,
`pubDatetime`, `description`, `tags`, `draft`). A post is a draft while
`draft: true`.

## Blog posts must pass the content-editor review before they ship

Whenever you write a new post or substantially edit an existing one, you MUST
run it through the `content-editor` review skill (in `./review/`) **in a
sub-agent** before treating it as done — i.e. before flipping `draft: false`,
opening a PR, or telling the author it's ready. This keeps the review's tropes
rubric and full-piece read out of the main context.

The fastest path is the slash command: `/review-post <path-to-post.md>`.

If you dispatch the sub-agent yourself instead, use the `Agent` tool
(`general-purpose`, run synchronously) with this instruction:

> Read `review/SKILL.md` and follow the content-editor procedure to review
> `<TARGET>`. If `<TARGET>` is a diff or a set of changed lines, review only
> added/modified prose. Return the review report and the inline diffs verbatim.

Then surface the report and diffs to the author. The skill suggests, it never
auto-applies — apply only the diffs the author approves.

Skip the review only if the author explicitly says to.
