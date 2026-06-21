import type { Site, SocialObjects } from "./types";

export const SITE: Site = {
  website: "https://blog.jordansimonov.ski/",
  author: "Jordan Simonovski",
  desc: "Jordan Simonovski's personal blog.",
  title: "JordanSimonov.ski",
  ogImage: "/og.png",
  lightAndDarkMode: true,
  postPerPage: 5,
  postPerIndex: 5,
  showArchives: true,
  showBackButton: true,
};

// GitHub Discussions-backed comments via giscus.
// Generate the repoId / categoryId at https://giscus.app and paste them here.
// `enabled` stays false until those are filled in (fail closed: no half-wired widget).
export const GISCUS = {
  enabled: true,
  repo: "jordan-simonovski/astro-blog" as `${string}/${string}`,
  repoId: "R_kgDOKJ2c_A",
  category: "Announcements",
  categoryId: "DIC_kwDOKJ2c_M4C_IX3",
  mapping: "pathname" as const,
  reactionsEnabled: "1" as const,
  inputPosition: "top" as const,
  lang: "en",
};

export const LOCALE = ["en-EN"]; // set to [] to use the environment default

export const LOGO_IMAGE = {
  enable: false,
  svg: true,
  width: 216,
  height: 46,
};

export const SOCIALS: SocialObjects = [
  {
    name: "Github",
    href: "https://github.com/jordan-simonovski",
    linkTitle: `${SITE.title} on Github`,
    active: true,
  },
  {
    name: "Bluesky",
    href: "https://bsky.app/profile/jordansimonov.ski",
    linkTitle: `${SITE.title} on Bluesky`,
    active: true,
  },
  {
    name: "Mastodon",
    href: "https://hachyderm.io/@jordan",
    linkTitle: `${SITE.title} on Mastodon`,
    active: true,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/83492895823/",
    linkTitle: `${SITE.title} on LinkedIn`,
    active: true,
  },
  {
    name: "CV",
    href: "https://cv.jordansimonov.ski",
    linkTitle: `${SITE.title} CV`,
    active: true,
  },
];
