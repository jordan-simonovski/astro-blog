// Display titles are set large, where straight quotes show. Frontmatter keeps
// plain ASCII; this curls it at render time.
const smartQuotes = (s: string) =>
  s
    .replace(/(^|[\s([{])'/g, "$1‘")
    .replace(/'/g, "’")
    .replace(/(^|[\s([{])"/g, "$1“")
    .replace(/"/g, "”");

export default smartQuotes;
