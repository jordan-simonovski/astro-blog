import { useEffect, useState } from "react";
import Giscus from "@giscus/react";
import { GISCUS } from "@config";

type GiscusTheme = "light" | "dark";

function readTheme(): GiscusTheme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.getAttribute("data-theme") === "dark"
    ? "dark"
    : "light";
}

export default function Comments() {
  const [theme, setTheme] = useState<GiscusTheme>("light");

  useEffect(() => {
    setTheme(readTheme());

    // Keep giscus in sync with the site's light/dark toggle, which mutates
    // `html[data-theme]`. Giscus reloads the iframe theme when this prop changes.
    const observer = new MutationObserver(() => setTheme(readTheme()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  // Sized wrapper gives the `client:visible` island a non-zero SSR box to
  // observe; without it the intersection observer has nothing to trigger on and
  // giscus never hydrates.
  return (
    <div className="giscus-wrapper min-h-[148px]">
      <Giscus
        id="comments"
        repo={GISCUS.repo}
        repoId={GISCUS.repoId}
        category={GISCUS.category}
        categoryId={GISCUS.categoryId}
        mapping={GISCUS.mapping}
        reactionsEnabled={GISCUS.reactionsEnabled}
        emitMetadata="0"
        inputPosition={GISCUS.inputPosition}
        theme={theme}
        lang={GISCUS.lang}
        loading="lazy"
      />
    </div>
  );
}
