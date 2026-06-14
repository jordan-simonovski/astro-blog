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
    linkTitle: ` ${SITE.title} on Github`,
    active: true,
  },
  {
    name: "X",
    href: "https://x.com/username",
    linkTitle: `${SITE.title} on X`,
    active: false,
  },
  {
    name: "Bluesky",
    href: "https://bsky.app/profile/jordansimonov.ski",
    linkTitle: `${SITE.title} on Bluesky`,
    active: true,
  },
  {
    name: "Threads",
    href: "https://www.threads.net/@username",
    linkTitle: `${SITE.title} on Threads`,
    active: false,
  },
  {
    name: "Facebook",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Facebook`,
    active: false,
  },
  {
    name: "Instagram",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Instagram`,
    active: false,
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
  {
    name: "Mail",
    href: "mailto:yourmail@gmail.com",
    linkTitle: `Send an email to ${SITE.title}`,
    active: false,
  },
  {
    name: "Twitter",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Twitter`,
    active: false,
  },
  {
    name: "Twitch",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Twitch`,
    active: false,
  },
  {
    name: "YouTube",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on YouTube`,
    active: false,
  },
  {
    name: "WhatsApp",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on WhatsApp`,
    active: false,
  },
  {
    name: "Snapchat",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Snapchat`,
    active: false,
  },
  {
    name: "Pinterest",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Pinterest`,
    active: false,
  },
  {
    name: "TikTok",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on TikTok`,
    active: false,
  },
  {
    name: "CodePen",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on CodePen`,
    active: false,
  },
  {
    name: "Discord",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Discord`,
    active: false,
  },
  {
    name: "GitLab",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on GitLab`,
    active: false,
  },
  {
    name: "Reddit",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Reddit`,
    active: false,
  },
  {
    name: "Skype",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Skype`,
    active: false,
  },
  {
    name: "Steam",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Steam`,
    active: false,
  },
  {
    name: "Telegram",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Telegram`,
    active: false,
  },
  {
    name: "Mastodon",
    href: "https://hachyderm.io/@jordan",
    linkTitle: `${SITE.title} on Mastodon`,
    active: true,
  },
];
