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