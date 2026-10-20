import {
    LANGUAGE_RULES, DEPENDENCY_RULES, NODE_BACKEND_DEPS, API_DESIGN_DEPS
} from "./skills.js";

const MAX_REPOS_TO_CHECK = 15;
const CONCURRENCY = 3;

function githubHeaders(token) {
    const headers = { Accept: "application/json" };
    if (token)
        headers.Authorization = "Bearer " + token;
    return headers;
}

export function skillsFromLanguages(languageBytes = {}) {
    let total = 0;
    for (const bytes of Object.values(languageBytes)) {
        total += bytes;
    }
    if (total == 0) {
        return [];
    }
    const bytesPerSkill = {};
    for (const language in languageBytes) {
        const skill = LANGUAGE_RULES[language];
        if (skill) {
            if (!bytesPerSkill[skill]) {
                bytesPerSkill[skill] = 0;
            }
            bytesPerSkill[skill] += languageBytes[language];
        }
    }

    const result = [];

    for (const skill in bytesPerSkill) {
        result.push(skill);
    }
    return result;
}

async function fetchLanguages(owner, repoName, token) {
    try {
        const res = await fetch(`https://api.github.com/repos/${owner}/${repoName}/languages`,
            { headers: githubHeaders(token) }
        );
        if (!res.ok)
            return {};
        return await res.json();
    } catch (error) {
        return {};
    }
}

async function fetchPackageJson(githubUsername, repoName, path, githubToken) {
    try {
        const url = `https://api.github.com/repos/${githubUsername}/${repoName}/contents/${path}`;

        const response = await fetch(url, { headers: githubHeaders(githubToken) });
        if (!response.ok) {
            return null;
        }

        const fileInfo = await response.json();
        if (!fileInfo || typeof fileInfo.content !== "string")
            return null;
        const decodedText = Buffer.from(fileInfo.content, "base64").toString("utf-8");
        return JSON.parse(decodedText);
    } catch (error) {
        return null;
    }
}

export function detectSkillsFromPackageJson(pkg) {
    if (!pkg)
        return [];
    const deps = Object.keys({
        ...pkg.dependencies,
        ...pkg.devDependencies,
    }).map(dep => dep.toLowerCase());

    const skills = new Set();

    for (const dep of deps) {
        const skill = DEPENDENCY_RULES[dep];
        if (skill)
            skills.add(skill);
    }

    if (deps.some(dep => NODE_BACKEND_DEPS.includes(dep))) {
        skills.add("NodeJs");
    }

    if (deps.filter(dep => API_DESIGN_DEPS.includes(dep)).length >= 2) {
        skills.add("API_Design");
    }

    return [...skills];
}

async function listPackageJsonPaths(owner, repoName, branch, token) {
    try {
        const url = `https://api.github.com/repos/${owner}/${repoName}/git/trees/${encodeURIComponent(branch || "HEAD")}?recursive=1`;
        const res = await fetch(url, {
            headers: githubHeaders(token),
        });

        if (!res.ok) {
            return [];
        }

        const data = await res.json();
        const tree = data.tree || [];

        const packageFiles = [];

        for (const file of tree) {
            if (file.type !== "blob") continue;
            if (!file.path.endsWith("package.json")) continue;
            if (file.path.includes("node_modules")) continue;
            if (file.path.split("/").length > 3) continue;

            packageFiles.push(file.path);
        }

        return packageFiles.sort((a, b) => a.split("/").length - b.split("/").length);

    } catch (error) {
        return [];
    }
}

export function pickReposToAnalyze(repoList) {
    return repoList
        .filter((repo) => !repo.fork)
        .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
        .slice(0, MAX_REPOS_TO_CHECK);
}

export async function analyzeRepo(owner, repo, token) {
    const skills = new Set();

    const languageBytes = await fetchLanguages(owner, repo.name, token);

    for (const skill of skillsFromLanguages(languageBytes)) {
        skills.add(skill);
    }

    const hasJsLike = languageBytes.JavaScript || languageBytes.TypeScript;

    if (hasJsLike) {
        const paths = await listPackageJsonPaths(owner, repo.name, repo.default_branch, token);

        for (const path of paths) {
            const pkg = await fetchPackageJson(owner, repo.name, path, token);

            for (const skill of detectSkillsFromPackageJson(pkg)) {
                skills.add(skill);
            }
        }
    }

    return [...skills];
}

export async function analyzeRepos(owner, repoList, token) {
    const repos = pickReposToAnalyze(repoList);
    const skillsByRepo = {};
    for (let i = 0; i < repos.length; i += CONCURRENCY) {
        const batch = repos.slice(i, i + CONCURRENCY);
        const results = await Promise.all(batch.map((repo) => analyzeRepo(owner, repo, token)));
        batch.forEach((repo, idx) => {
            skillsByRepo[repo.name] = results[idx];
        });
    }
    return skillsByRepo;
}