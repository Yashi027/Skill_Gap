import { detectFrameworks, fetchPackageJson, MAX_REPOS_TO_CHECK } from "../utils/frameworkDetector.js";
import { buildSkillEvidence, verifySkills } from "../utils/skillVerification.js";
import CAREER_SKILLS, { generateRoadmap } from "../utils/roadmap.js";

const SYNC_MAP = {
    JavaScript: "JavaScript",
    TypeScript: "JavaScript",
    HTML: "HTML",
    CSS: "CSS",
    React: "React",
    NodeJs: "NodeJs",
    Express: "Express",
    Mongoose: "MongoDb"
}

const EMPTY_CALENDAR = { totalContributions: 0, weeks: [] };

const fetchContributionCalendar = async (githubUsername) => {
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
        return EMPTY_CALENDAR;
    }
    try {
        const graphqlQuery = {
            query: `
                query($login:String!) {
                    user(login:$login) {
                    contributionsCollection {
                        contributionCalendar {
                        totalContributions
                        weeks { contributionDays { date contributionCount } }
                        }
                    }
                }
              }
            `,
            variables: { login: githubUsername }
        };
        const response = await fetch("https://api.github.com/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token
            },
            body: JSON.stringify(graphqlQuery)
        });
        const result = await response.json();

        if (result.errors) {
            console.warn("Github GraphQL error:", result.errors);
            return EMPTY_CALENDAR;
        }

        const calendar = result.data && result.data.user ? result.data.user.contributionsCollection.contributionCalendar : null;

        return calendar || EMPTY_CALENDAR;
    } catch (error) {
        console.warn("Failed to fetch contribution calendar:", error.message);
        return EMPTY_CALENDAR;
    }
}


const calculateStreak = (calendar) => {
    const allDays = calendar.weeks.flatMap((week) => week.contributionDays)
    const daysNewestFirst = allDays.reverse();

    let streak = 0;
    for (const day of daysNewestFirst) {
        if (day.contributionCount > 0) {
            streak = streak + 1;
        } else {
            break;
        }
    }
    return streak;
}

const calculateWeeklyProgress = (calendar) => {
    const allDays = (calendar.weeks || []).flatMap((week) => week.contributionDays || []);

    const contributionsByDate = new Map(allDays.map((day) => [day.date, day.contributionCount]))

    const weeklyProgress = [];

    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setUTCHours(0, 0, 0, 0);
        date.setUTCDate(date.getUTCDate() - i);

        const dateKey = date.toISOString().slice(0, 10);

        weeklyProgress.push(contributionsByDate.get(dateKey) ?? 0);
    }
    return weeklyProgress;
}

const countLanguages = (repoList) => {
    const languageCounts = {};
    for (const repo of repoList) {
        if (repo.language) {
            const currentCount = languageCounts[repo.language] || 0;
            languageCounts[repo.language] = currentCount + 1;
        }
    }
    return languageCounts;
}

const ratingFromRepoCount = (count) => {
    if (count > 5)
        return 5;
    if (count >= 3)
        return 4;
    if (count === 2)
        return 3;
    if (count === 1)
        return 2;
    return 1;
}

const buildAutoRatings = (skillEvidence) => {
    const autoRatings = {};
    for (const [skillName, evidence] of Object.entries(skillEvidence)) {
        autoRatings[skillName] = ratingFromRepoCount(evidence.repoCount);
    }
    return autoRatings;
}

const calculateProfileScore = (careerSkills, skillEvidence, analyzedAt = new Date()) => {
    if (!careerSkills.length) return 0;

    const now = analyzedAt.getTime();
    const points = careerSkills.reduce((total, skill) => {
        const evidence = skillEvidence[skill];
        if (!evidence?.repoCount || !evidence.lastActivityDate) return total;

        const depthPoints = Math.min(evidence.repoCount / 3, 1) * 70;
        const ageDays = Math.max(0, (now - new Date(evidence.lastActivityDate).getTime()) / (1000 * 60 * 60 * 24));
        const freshnessPoints = ageDays <= 180 ? 30 : ageDays <= 365 ? 20 : ageDays <= 730 ? 10 : 0;
        return total + depthPoints + freshnessPoints;
    }, 0);

    return Math.round(points / careerSkills.length);
}

async function detectFrameworksAcrossRepos(githubUsername, repoList, githubToken) {
    const jsTsRepos = [];
    for (const repo of repoList) {
        if (repo.language === "JavaScript" || repo.language === "TypeScript") {
            jsTsRepos.push(repo);
        }
    }

    jsTsRepos.sort((repoA, repoB) => {
        return new Date(repoB.pushed_at) - new Date(repoA.pushed_at);
    });

    const reposToCheck = jsTsRepos.slice(0, MAX_REPOS_TO_CHECK);

    const frameworksByRepo = {};
    for (const repo of reposToCheck) {
        const packageJson = await fetchPackageJson(githubUsername, repo.name, githubToken);
        frameworksByRepo[repo.name] = detectFrameworks(packageJson);
    }
    return frameworksByRepo;
}

export const analyzeGithubUser = async (req, res) => {
    try {
        const githubUsername = req.params.username?.trim();
        if (!githubUsername) {
            return res.status(400).json({ message: "GitHub username is required" });
        }

        const githubToken = process.env.GITHUB_TOKEN;
        const headers = {
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28"
        };
        if (githubToken) headers.Authorization = `Bearer ${githubToken}`;

        const profileResponse = await fetch(`https://api.github.com/users/${encodeURIComponent(githubUsername)}`, { headers });
        if (profileResponse.status === 404) {
            return res.status(404).json({ message: "GitHub user not found" });
        }
        if (!profileResponse.ok) {
            return res.status(profileResponse.status === 403 ? 502 : profileResponse.status).json({
                message: "GitHub API request failed",
                ...(profileResponse.status === 403 ? { detail: "GitHub API rate limit may have been reached" } : {})
            });
        }
        const profile = await profileResponse.json();

        const repoList = [];
        for (let page = 1; ; page += 1) {
            const reposResponse = await fetch(
                `https://api.github.com/users/${encodeURIComponent(profile.login)}/repos?type=owner&sort=updated&per_page=100&page=${page}`,
                { headers }
            );
            if (!reposResponse.ok) {
                return res.status(reposResponse.status === 403 ? 502 : reposResponse.status).json({
                    message: "Failed to fetch GitHub repositories"
                });
            }
            const reposPage = await reposResponse.json();
            if (!Array.isArray(reposPage)) {
                return res.status(502).json({ message: "GitHub returned an invalid repositories response" });
            }
            repoList.push(...reposPage);
            if (reposPage.length < 100) break;
        }

        const [contributionCalendar, frameworksByRepo] = await Promise.all([
            fetchContributionCalendar(profile.login),
            detectFrameworksAcrossRepos(profile.login, repoList, githubToken)
        ]);
        const languageCounts = countLanguages(repoList);
        const skillEvidence = buildSkillEvidence(repoList, SYNC_MAP, frameworksByRepo);
        const suggestedRatings = buildAutoRatings(skillEvidence);
        const existingRatings = Object.fromEntries(req.user.skillRatings || new Map());
        const skillRatings = { ...existingRatings };
        for (const [skill, rating] of Object.entries(suggestedRatings)) {
            skillRatings[skill] = Math.max(Number(skillRatings[skill]) || 0, rating);
        }

        const skillVerification = verifySkills(skillRatings, skillEvidence);
        const streak = calculateStreak(contributionCalendar);
        const weeklyProgress = calculateWeeklyProgress(contributionCalendar);
        const careerSkills = CAREER_SKILLS[req.user.selectedCareer] || [];
        const score = calculateProfileScore(careerSkills, skillEvidence);

        req.user.githubUsername = profile.login;
        req.user.githubData = {
            login: profile.login,
            name: profile.name?.trim() || profile.login,
            avatar: profile.avatar_url,
            profile_url: profile.html_url,
            bio: profile.bio,
            location: profile.location,
            followers: profile.followers,
            following: profile.following,
            repoCount: profile.public_repos,
            score,
            skillsWithEvidence: Object.keys(skillEvidence).length,
            languages: languageCounts,
            frameworksByRepo,
            contributionCalendar,
            streak,
            weeklyProgress,
            analyzedAt: new Date().toISOString()
        };
        req.user.skillRatings = new Map(Object.entries(skillRatings));
        req.user.roadmap = generateRoadmap(req.user.selectedCareer, skillRatings);
        req.user.skillEvidence = skillEvidence;
        req.user.skillVerification = skillVerification;
        req.user.streak = streak;
        req.user.weeklyProgress = weeklyProgress;
        await req.user.save();

        return res.json({ user: req.user.toProfileJSON() });
    } catch (error) {
        console.error("GitHub profile analysis failed:", error.message);
        res.status(500).json({ message: "Failed to analyze GitHub profile", error: error.message });
    }
}
