
const SYNC_MAP = {
    JavaScript: "JavaScript",
    TypeScript: "JavaScript",
    HTML: "HTML",
    CSS: "CSS",
    React: "React",
    NodeJs: "NodeJs",
    Express: "Express",
    Mongoose: "Mongoose"
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

const buildAutoRatings = (languageCounts) => {
    const autoRatings = {};
    for (const language in languageCounts) {
        const skillName = SYNC_MAP[language];
        if (!skillName)
            continue;
        const suggestedRating = ratingFromRepoCount(languageCounts[language]);
        const existingRating = autoRatings[skillName] || 0;
        autoRatings[skillName] = Math.max(existingRating, suggestedRating);
    }
    return autoRatings;
}