import {
    LANGUAGE_RULES, DEPENDENCY_RULES, NODE_BACKEND_DEPS, API_DESIGN_DEPS
} from "./skills.js";

const MAX_REPOS_TO_CHECK = 15;
const CONCURRENCY = 3;

function githubHeaders(token){
    const headers = {Accept: "application/vnd.github+json"};
    if(token)
        headers.Authorization = "Bearer " + token;
    return headers;
}

async function fetchPackageJson(githubUsername, repoName, githubToken) {
    try {
        const url = `https://api.github.com/repos/${githubUsername}/${repoName}/contents/package.json`;
        const headers = {};
        if (githubToken) {
            headers.Authorization = "Bearer " + githubToken;
        }
        const response = await fetch(url, { headers });
        if (!response.ok) {
            return null;
        }

        const fileInfo = await response.json();
        const decodedText = Buffer.from(fileInfo.content, "base64").toString("utf-8");
        return JSON.parse(decodedText);
    } catch (error) {
        return "Something went wrong";
    }
}

function detectFrameworks(packageJson) {
    const foundSkills = [];
    if (!packageJson) {
        return foundSkills;
    }
    const normalDependencies = packageJson.dependencies || {};
    const devDependencies = packageJson.devDependencies || {};
    const allDependency = [
        ...Object.keys(normalDependencies),
        ...Object.keys(devDependencies)
    ]

    for (const packageName of allDependency) {
        const skill = FRAMEWORK_SKILL_MAP[packageName.toLowerCase()];
        if (skill && !foundSkills.includes(skill)) {
            foundSkills.push(skill);
        }
    }
    return foundSkills;
}

export { MAX_REPOS_TO_CHECK, fetchPackageJson, detectFrameworks };