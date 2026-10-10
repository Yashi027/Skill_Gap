const buildSkillEvidence = (repoList, languageToSkillMap, frameworksFound) => {
    const evidence = {};

    function addProof(skillName, repo) {
        if (!skillName)
            return;
        if (!evidence[skillName]) {
            evidence[skillName] = {
                repoCount: 0,
                lastActivityDate: null,
                repos: []
            };
        }

        const record = evidence[skillName];
        record.repoCount = record.repoCount + 1;
        record.repos.push({
            name: repo.name,
            url: repo.html_url,
            pushedAt: repo.pushed_at
        });
        const isNewer = !record.lastActivityDate || new Date(repo.pushed_at) > new Date(record.lastActivityDate)
        if (isNewer) {
            record.lastActivityDate = repo.pushed_at;
        }
    }

    for (const repo of repoList) {
        const skillFromLanguage = languageToSkillMap[repo.language];
        if (skillFromLanguage) {
            addProof(skillFromLanguage, repo)
        }
        const frameworksInThisRepo = frameworksFound[repo.name] || [];
        for (const skill of frameworksInThisRepo) {
            addProof(skill, repo);
        }
    }
    return evidence;
}

function verifySkills(skillRatings, evidence){
    const result = {};
    for (const skillName in skillRatings){
        const rating = skillRatings[skillName];
        const proof = evidence[skillName];

        if(rating <= 2){
            result[skillName] = {
                status: "not-applicable",
                reason: "Low self-rating - no verification needed"
            }
            continue;
        }

        if(!proof || proof.repoCount === 0){
            result[skillName] = {
                status: "unverified",
                reason: `Rated ${rating}/5 but no Github repos show evidence of ${skillName}`
            }
            continue;
        }

        const daysSinceLastUse = (Date.now() - new Date(proof.lastActivityDate))/ (1000 * 60 * 60 * 24);
        const monthsSinceLastUse = daysSinceLastUse/30;

        const notEnoughRepos = proof.repoCount < 2;
        const tooOld = monthsSinceLastUse > 12;

        if(rating >= 4 && (notEnoughRepos || tooOld)){
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
            reason: `${proof.count} repo(s) on github support this rating`
        }
    }
    return result;
}

export {buildSkillEvidence, verifySkills};