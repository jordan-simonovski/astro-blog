const primaryColorScheme = ""; // "light" | "dark"

function getPreferTheme() {
  // return theme value in local storage if it is set
  const currentTheme = localStorage.getItem("theme");
  if (currentTheme) return currentTheme;

  // return primary color scheme if it is set
  if (primaryColorScheme) return primaryColorScheme;

  // return user device's prefer color scheme
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

let themeValue = getPreferTheme();

function setPreference() {
  localStorage.setItem("theme", themeValue);
  reflectPreference();
}

function reflectPreference() {
  document.firstElementChild.setAttribute("data-theme", themeValue);

  document
    .querySelectorAll(".theme-btn")
    .forEach(btn => btn.setAttribute("aria-label", themeValue));
}

// set early so no page flashes / CSS is made aware
reflectPreference();

window.onload = () => {
  function setThemeFeature() {
    // set on load so screen readers can get the latest value on the button
    reflectPreference();

    // now this script can find and listen for clicks on the control(s).
    // Mobile and desktop each render their own button, hence querySelectorAll.
    document.querySelectorAll(".theme-btn").forEach(btn =>
      btn.addEventListener("click", () => {
        themeValue = themeValue === "light" ? "dark" : "light";
        setPreference();
      })
    );
  }

  setThemeFeature();
};

// A page restored from the back/forward cache, or prerendered before the
// reader toggled the theme, can hold a stale value. Re-read on show.
window.addEventListener("pageshow", () => {
  themeValue = getPreferTheme();
  reflectPreference();
});
document.addEventListener("prerenderingchange", () => {
  themeValue = getPreferTheme();
  reflectPreference();
});

// sync with system changes
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", ({ matches: isDark }) => {
    themeValue = isDark ? "dark" : "light";
    setPreference();
  });
