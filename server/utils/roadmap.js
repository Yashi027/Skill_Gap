const CAREER_SKILLS = {
    frontend: ["HTML","CSS","JavaScript","React","Redux"],
    backend: ["NodeJs", "Express", "MongoDb", "SQL", "API_Design"],
    fullstack: ["HTML","CSS","JavaScript","React","NodeJs","Express","MongoDb"]
};

export const generateRoadmap = (selectedCareer, skillRatings = {}) => {
    const skills = CAREER_SKILLS[selectedCareer] || [];
    return skills.map((skill) => {
        const rating = skillRatings[skill] || 0;

        return {
            name: skill,
            difficulty: rating<=2 ? "Beginner" : rating==3 ? "Intermediate" : "Advanced",
            priority: rating<=2 ? "High" : rating === 3 ? "Medium" : "Low"
        };
    });
};

export const calculateProgress = (roadmap = [], skillRatings = {}) => {
    if(!roadmap.length)
        return 0;
    const completed = roadmap.filter((item) => skillRatings[item.name] === 5).length;
    return Math.round((completed/roadmap.length)*100);
}

export default CAREER_SKILLS;