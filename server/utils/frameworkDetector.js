const FRAMEWORK_SKILL_MAP = {
    "react": "React",
    "react-dom": "React",
    "redux": "Redux",
    "react-redux": "Redux",
    "express": "Express",
    "mongoose": "MongoDb"
}

const MAX_REPOS_TO_CHECK = 15;

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

export { MAX_REPOS_TO_CHECK, detectFrameworks };