# Judgment Rules

How to decide what counts as a problem. The tropes list is the pattern
catalogue; these rules govern when a pattern is actually worth flagging.

## Scope

Review prose only. Ignore everything inside:
- Fenced code blocks (```), inline code (backticks)
- YAML frontmatter
- Blockquotes that quote source material
- URLs, image alt text, raw HTML
- Tables of config, log output, technical identifiers

Technical identifiers, log lines, attribute dumps, and config are never slop.
A post about OTel or ClickHouse will be full of `otelcol_receiver_accepted_spans`
and similar. None of that is prose. Do not flag it.

## Density over presence

Any single trope used once is usually fine. Flag a trope only when:
1. It is used repeatedly (three or more times for most patterns), OR
2. It is one of the high-signal tells that is rarely acceptable even once:
   negative parallelism, "The X? A Y." rhetorical-question-answer, "Here's the
   kicker / here's the thing", em-dash addiction (count them), bold-first
   bullets, unicode decoration (curly quotes, arrows), and the signposted
   conclusion ("In conclusion").

Count, don't vibe. For em dashes and curly quotes, give the actual count. For
repeated patterns, cite each occurrence with its line.

## Voice is not slop

Jordan's voice has specific markers that are NOT violations and must be
preserved untouched:
- Profanity and dry self-deprecation
- Parenthetical asides
- Strong opinions stated flatly
- Embedded-systems and ops gallows humour
- Casual, informal register

Never flag writing for being casual, opinionated, profane, or for having
personality. If a construction has the shape of a trope but is clearly doing
real conceptual work and lands, leave it and say why.

## Deliberate signature vs tic

If a construction appears once and lands, leave it. If the same move appears
three or more times, flag the repetition, not the first instance. When you flag
a repeated pattern, point to the first acceptable use and the later redundant
ones separately, so the author can keep one and cut the rest.

## Style constraints specific to this author

- Em dashes: the author avoids them by preference. Any em dash is worth
  flagging, not just at high density. Suggest a rewrite to comma, colon, or
  full stop.
- Bullet overuse: the author avoids leaning on bullet lists. Flag prose that
  has been chopped into a list where flowing prose would read better.