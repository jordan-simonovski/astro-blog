import getReadingTime from "reading-time";
import { toString } from "mdast-util-to-string";

// Reading time should reflect prose a human actually reads. Fenced code blocks
// are illustrative (and one of these posts hides a very large skill block), so
// strip block-level `code` nodes before counting. Inline code stays: it's part
// of a sentence.
function proseText(node) {
  if (node.type === "code") return "";
  if (node.children) return node.children.map(proseText).join(" ");
  return toString(node);
}

export function remarkReadingTime() {
  return function (tree, { data }) {
    const textOnPage = proseText(tree);
    const readingTime = getReadingTime(textOnPage);
    data.astro.frontmatter.readingTime = readingTime.text;
  };
}
