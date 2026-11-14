import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { codeToTokens, type BundledLanguage } from "shiki";

type Token = [text: string, light: string, dark: string];

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const registryPath = join(root, "src/lib/review/files.json");
const outputPath = join(root, "src/generated/review-sources.json");

const languages: Record<string, BundledLanguage> = {
  ".ts": "ts",
  ".tsx": "tsx",
  ".js": "js",
  ".mjs": "js",
  ".css": "css",
  ".json": "json",
};

function git(...args: string[]) {
  try {
    const output = execFileSync("git", args, {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    return output || null;
  } catch {
    return null;
  }
}

function repoUrl() {
  const { VERCEL_GIT_PROVIDER, VERCEL_GIT_REPO_OWNER, VERCEL_GIT_REPO_SLUG, GITHUB_REPOSITORY } =
    process.env;
  if (VERCEL_GIT_PROVIDER === "github" && VERCEL_GIT_REPO_OWNER && VERCEL_GIT_REPO_SLUG) {
    return `https://github.com/${VERCEL_GIT_REPO_OWNER}/${VERCEL_GIT_REPO_SLUG}`;
  }
  if (GITHUB_REPOSITORY) return `https://github.com/${GITHUB_REPOSITORY}`;

  const remote = git("remote", "get-url", "origin");
  const match = remote?.match(/github\.com[:/]([^/]+)\/(.+?)(?:\.git)?$/);
  return match ? `https://github.com/${match[1]}/${match[2]}` : null;
}

async function highlight(path: string): Promise<Token[][]> {
  const absolute = join(root, path);
  if (!existsSync(absolute)) {
    throw new Error(`Review registry points at a missing file: ${path}`);
  }

  const code = readFileSync(absolute, "utf8").replace(/\r\n/g, "\n").replace(/\n$/, "");
  const lang = languages[extname(path)];
  if (!lang) return code.split("\n").map((line) => (line ? [[line, "", ""]] : []));

  const { tokens } = await codeToTokens(code, {
    lang,
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: false,
  });

  return tokens.map((line) =>
    line.reduce<Token[]>((merged, token) => {
      const style = token.htmlStyle ?? {};
      const light = style["--shiki-light"] ?? "";
      const dark = style["--shiki-dark"] ?? "";
      const previous = merged.at(-1);
      if (previous && previous[1] === light && previous[2] === dark) {
        previous[0] += token.content;
      } else {
        merged.push([token.content, light, dark]);
      }
      return merged;
    }, []),
  );
}

const registry: Record<string, string[]> = JSON.parse(readFileSync(registryPath, "utf8"));
const paths = [...new Set(Object.values(registry).flat())];

const files: Record<string, { lang: string; lines: Token[][] }> = {};
for (const path of paths) {
  files[path] = { lang: languages[extname(path)] ?? "text", lines: await highlight(path) };
}

const snapshot = {
  sha:
    process.env.VERCEL_GIT_COMMIT_SHA ||
    process.env.GITHUB_SHA ||
    git("rev-parse", "HEAD") ||
    "unknown",
  repoUrl: repoUrl(),
  pathPrefix: git("rev-parse", "--show-prefix") ?? "apps/web/",
  sections: registry,
  files,
};

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, JSON.stringify(snapshot));
console.log(`Review sources: ${paths.length} files at ${snapshot.sha.slice(0, 7)}`);
