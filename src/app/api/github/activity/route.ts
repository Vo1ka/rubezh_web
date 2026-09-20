import { NextResponse } from "next/server";
import { GITHUB_API, githubHeaders } from "@/lib/github";

export type EpicActivityCommit = {
  sha: string;
  message: string;
  author: string;
  date: string;
  url: string;
};

export type EpicActivityResponse = {
  repoUrl: string;
  pathUrl: string;
  defaultBranch: string;
  commits: EpicActivityCommit[];
  error?: string;
};

export async function GET(request: Request) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "GITHUB_TOKEN не настроен на сервере" }, { status: 501 });
  }

  const { searchParams } = new URL(request.url);
  const owner = searchParams.get("owner");
  const repo = searchParams.get("repo");
  const path = searchParams.get("path");
  if (!owner || !repo) {
    return NextResponse.json({ error: "owner и repo обязательны" }, { status: 400 });
  }

  const headers = githubHeaders(token);
  const repoUrl = `https://github.com/${owner}/${repo}`;
  const pathUrl = path ? `${repoUrl}/tree/HEAD/${path}` : repoUrl;

  const [repoRes, commitsRes] = await Promise.all([
    fetch(`${GITHUB_API}/repos/${owner}/${repo}`, { headers }),
    fetch(
      `${GITHUB_API}/repos/${owner}/${repo}/commits?per_page=5${path ? `&path=${encodeURIComponent(path)}` : ""}`,
      { headers }
    ),
  ]);

  if (!repoRes.ok) {
    const body: EpicActivityResponse = {
      repoUrl,
      pathUrl,
      defaultBranch: "",
      commits: [],
      error: `GitHub API: ${repoRes.status} ${repoRes.statusText}`,
    };
    return NextResponse.json(body);
  }

  const repoData = await repoRes.json();
  const commitsData = commitsRes.ok ? await commitsRes.json() : [];

  const commits: EpicActivityCommit[] = Array.isArray(commitsData)
    ? commitsData.map((c: {
        sha: string;
        html_url: string;
        commit: { message: string; author?: { name?: string; date?: string } };
        author?: { login?: string };
      }) => ({
        sha: c.sha.slice(0, 7),
        message: c.commit.message.split("\n")[0],
        author: c.commit.author?.name ?? c.author?.login ?? "неизвестно",
        date: c.commit.author?.date ?? "",
        url: c.html_url,
      }))
    : [];

  const body: EpicActivityResponse = {
    repoUrl: repoData.html_url ?? repoUrl,
    pathUrl: path ? `${repoData.html_url ?? repoUrl}/tree/${repoData.default_branch ?? "HEAD"}/${path}` : (repoData.html_url ?? repoUrl),
    defaultBranch: repoData.default_branch ?? "",
    commits,
    error: commitsRes.ok ? undefined : `Коммиты: ${commitsRes.status} ${commitsRes.statusText}`,
  };

  return NextResponse.json(body);
}
