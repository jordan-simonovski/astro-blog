export interface RepoRef {
  fullName: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  url: string;
}

export interface RepoData extends RepoRef {
  /** Set when this repo is a fork and GitHub returned the upstream repo. */
  parent: RepoRef | null;
  /** True when the GitHub lookup failed and only the link is trustworthy. */
  degraded: boolean;
}

const cache = new Map<string, Promise<RepoData>>();

function degraded(repo: string): RepoData {
  return {
    fullName: repo,
    description: null,
    language: null,
    stars: 0,
    forks: 0,
    url: `https://github.com/${repo}`,
    parent: null,
    degraded: true,
  };
}

function toRef(json: any, fallbackName: string): RepoRef {
  return {
    fullName: json?.full_name ?? fallbackName,
    description: json?.description ?? null,
    language: json?.language ?? null,
    stars: json?.stargazers_count ?? 0,
    forks: json?.forks_count ?? 0,
    url: json?.html_url ?? `https://github.com/${fallbackName}`,
  };
}

async function fetchRepoData(repo: string): Promise<RepoData> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "astro-blog-repocard",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(`https://api.github.com/repos/${repo}`, { headers });
  } catch (err) {
    console.warn(`[RepoCard] network error fetching "${repo}":`, err);
    return degraded(repo);
  }

  if (!res.ok) {
    console.warn(
      `[RepoCard] GitHub API returned ${res.status} ${res.statusText} for "${repo}"` +
        (res.status === 403 ? " (likely rate limited; set GITHUB_TOKEN)" : "")
    );
    return degraded(repo);
  }

  const json = await res.json();
  return {
    ...toRef(json, repo),
    parent: json.fork && json.parent ? toRef(json.parent, repo) : null,
    degraded: false,
  };
}

/** Fetch repo metadata at build time. Cached per repo; never throws. */
export function getRepoData(repo: string): Promise<RepoData> {
  const key = repo.trim().toLowerCase();
  const existing = cache.get(key);
  if (existing) return existing;
  const promise = fetchRepoData(repo.trim());
  cache.set(key, promise);
  return promise;
}
