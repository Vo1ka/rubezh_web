import { NextResponse } from "next/server";
import { TRACKED_REPOS } from "@/lib/repos";
import { GITHUB_API, githubHeaders } from "@/lib/github";

type RepoStatus = {
  label: string;
  owner: string;
  repo: string;
  url: string;
  description: string | null;
  defaultBranch: string;
  openIssues: number;
  openPullRequests: number;
  lastCommit: {
    sha: string;
    message: string;
    author: string;
    date: string;
  } | null;
  error?: string;
};

async function fetchRepoStatus(
  owner: string,
  repo: string,
  label: string,
  token: string
): Promise<RepoStatus> {
  const headers = githubHeaders(token);

  const [repoRes, commitsRes, pullsRes] = await Promise.all([
    fetch(`${GITHUB_API}/repos/${owner}/${repo}`, { headers }),
    fetch(`${GITHUB_API}/repos/${owner}/${repo}/commits?per_page=1`, {
      headers,
    }),
    fetch(`${GITHUB_API}/repos/${owner}/${repo}/pulls?state=open&per_page=100`, {
      headers,
    }),
  ]);

  if (!repoRes.ok) {
    return {
      label,
      owner,
      repo,
      url: `https://github.com/${owner}/${repo}`,
      description: null,
      defaultBranch: "",
      openIssues: 0,
      openPullRequests: 0,
      lastCommit: null,
      error: `GitHub API: ${repoRes.status} ${repoRes.statusText}`,
    };
  }

  const repoData = await repoRes.json();
  const commitsData = commitsRes.ok ? await commitsRes.json() : [];
  const pullsData = pullsRes.ok ? await pullsRes.json() : [];

  const lastCommitRaw = Array.isArray(commitsData) ? commitsData[0] : null;

  return {
    label,
    owner,
    repo,
    url: repoData.html_url,
    description: repoData.description,
    defaultBranch: repoData.default_branch,
    openIssues: Math.max(
      0,
      (repoData.open_issues_count ?? 0) -
        (Array.isArray(pullsData) ? pullsData.length : 0)
    ),
    openPullRequests: Array.isArray(pullsData) ? pullsData.length : 0,
    lastCommit: lastCommitRaw
      ? {
          sha: lastCommitRaw.sha.slice(0, 7),
          message: lastCommitRaw.commit.message.split("\n")[0],
          author:
            lastCommitRaw.commit.author?.name ??
            lastCommitRaw.author?.login ??
            "неизвестно",
          date: lastCommitRaw.commit.author?.date ?? "",
        }
      : null,
  };
}

export async function GET() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: "GITHUB_TOKEN не настроен на сервере" },
      { status: 501 }
    );
  }

  const statuses = await Promise.all(
    TRACKED_REPOS.map((r) => fetchRepoStatus(r.owner, r.repo, r.label, token))
  );

  return NextResponse.json({ repos: statuses });
}
