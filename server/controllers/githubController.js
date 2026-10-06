
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
        const response = await fetch("https://api.github.com/graphql",{
            method: "POST",
            headers:{
                "Content-Type": "application/json",
                Authorization: "Bearer "+token
            },
            body: JSON.stringify(graphqlQuery)
        });
        const result = await response.json();

        if(result.errors){
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

}

const countLanguages = (repoList) => {

}

const ratingFromRepoCount = (count) => {

}

const buildAutoRatings = (languageCounts) => {

}