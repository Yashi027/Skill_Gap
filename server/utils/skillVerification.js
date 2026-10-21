import { normalizeSkillObject } from "./skills.js";

const buildSkillEvidence = (repoList, skillsByRepo) => {
    const evidence = {};
    const repoMap = {};

    for (const repo of repoList) {
        repoMap[repo.name] = repo;
    }

    for (const repoName in skillsByRepo) {
        const repo = repoMap[repoName];
        if (!repo)
            continue;
        const skills = skillsByRepo[repoName];

        for (const skill of skills) {
            if (!evidence[skill]) {
                evidence[skill] = {
                    repoCount: 0,
                    lastActivityDate: null,
                    repos: []
                };
            }
            const skillData = evidence[skill];
            skillData.repoCount++;
            skillData.repos.push({
                name: repo.name,
                url: repo.html_url,
                pushedAt: repo.pushed_at
            });

            if (!skillData.lastActivityDate || new Date(repo.pushed_at) > new Date(skillData.lastActivityDate)) {
                skillData.lastActivityDate = repo.pushed_at;
            }
        }
    }
    return evidence;
}

function ratingFromEvidence(proof) {
    if (!proof || proof.repoCount === 0)
        return 0;
    let rating = proof.repoCount >= 4 ? 4 : proof.repoCount >= 2 ? 3 : 2;
    let monthsSinceUse = (Date.now() - new Date(proof.lastActivityDate)) / (1000 * 60 * 60 * 24 * 30);
    if (monthsSinceUse > 12)
        rating -= 1;
    return Math.max(rating, 1);
}

function buildAutoRatings(evidence) {
    const ratings = {};
    for (const [skill, proof] of Object.entries(evidence)) {
        const rating = ratingFromEvidence(proof);
        if (rating > 0)
            ratings[skill] = rating;
    }
    return ratings;
}

function verifySkills(skillRatings, evidence) {
    const ratings = normalizeSkillObject(skillRatings);
    const proofs = normalizeSkillObject(evidence);
    const result = {};

    for (const skillName in ratings) {
        const rating = ratings[skillName];
        const proof = proofs[skillName];

        if (rating <= 2) {
            result[skillName] = {
                status: "not-applicable",
                reason: "Low self-rating - no verification needed"
            }
            continue;
        }

        if (!proof || proof.repoCount === 0) {
            result[skillName] = {
                status: "unverified",
                reason: `Rated ${rating}/5 but no Github repos show evidence of ${skillName}`
            }
            continue;
        }

        const monthsSinceLastUse = (Date.now() - new Date(proof.lastActivityDate)) / (1000 * 60 * 60 * 24 * 30);

        const notEnoughRepos = proof.repoCount < 2;
        const tooOld = monthsSinceLastUse > 12;

        if (rating >= 4 && (notEnoughRepos || tooOld)) {
            result[skillName] = {
                status: "weak-evidence",
                reason: notEnoughRepos
                    ? `Only ${proof.repoCount} repo found for a ${rating}/5 claim.`
                    : `Evidence is over a year old for a ${rating}/5 claim.`
            }
            continue;
        }

        result[skillName] = {
            status: "verified",
            reason: `${proof.repoCount} repo(s) on GitHub support this rating`
        }
    }
    return result;
}

export { buildSkillEvidence, buildAutoRatings, ratingFromEvidence, verifySkills };
