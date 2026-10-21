import { CAREER_SKILLS, normalizeSkillObject } from "./skills.js";

export const generateRoadmap = (selectedCareer, skillRatings = {}) => {
    const skills = CAREER_SKILLS[selectedCareer] || [];
    const ratings = normalizeSkillObject(skillRatings);

    return skills.map((skill) => {
        const rating = ratings[skill] || 0;

        return {
            name: skill,
            difficulty: rating <= 2 ? "Beginner" : rating == 3 ? "Intermediate" : "Advanced",
            priority: rating <= 2 ? "High" : rating === 3 ? "Medium" : "Low"
        };
    });
};

export const calculateProgress = (roadmap = [], skillRatings = {}) => {
    if (!roadmap.length)
        return 0;
    const ratings = normalizeSkillObject(skillRatings);
    const completed = roadmap.filter((item) => ratings[item.name] === 5).length;
    return Math.round((completed / roadmap.length) * 100);
}
