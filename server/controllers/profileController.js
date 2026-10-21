import { generateRoadmap, calculateProgress } from "../utils/roadmap.js";
import { verifySkills } from "../utils/skillVerification.js";
import { CAREERS_KEYS, SKILLS, normalizeSkillObject } from "../utils/skills.js";

export const getProfile = async (req, res) => {
    res.json({ user: req.user.toProfileJSON() });
};

export const setCareer = async (req, res) => {
    try {
        const { selectedCareer } = req.body;
        const allowed = ["", ...CAREERS_KEYS];

        if (!allowed.includes(selectedCareer)) {
            return res.status(400).json({ message: "Select valid career path" });
        }

        const user = req.user;
        user.selectedCareer = selectedCareer;

        const ratings = Object.fromEntries(user.skillRatings || new Map());
        user.roadmap = generateRoadmap(selectedCareer, ratings);

        await user.save();
        return res.json({
            user: user.toProfileJSON(),
            progress: calculateProgress(user.roadmap, ratings)
        });
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const updateSkillRatings = async (req, res) => {
    try {
        const skillRatings = req.body?.skillRatings;
        if (!skillRatings || typeof skillRatings !== "object") {
            return res.status(400).json({ success: false, message: "Skill ratings object is required" });
        }

        const validRatings = {};
        for (const [skill, value] of Object.entries(normalizeSkillObject(skillRatings))) {
            if (!SKILLS[skill])
                continue;
            const rating = Number(value);
            if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
                return res.status(400).json({ message: `Invalid rating for ${skill}` })
            }
            validRatings[skill] = rating;
        }

        const user = req.user;

        user.skillRatings = new Map(Object.entries(validRatings));
        user.roadmap = generateRoadmap(user.selectedCareer, validRatings);
        user.skillVerification = verifySkills(validRatings, user.skillEvidence || {});
        await user.save();

        return res.json({
            user: user.toProfileJSON(),
            progress: calculateProgress(user.roadmap, validRatings)
        });
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const getProgress = async (req, res) => {
    const user = req.user;
    const ratings = normalizeSkillObject(Object.fromEntries(user.skillRatings || new Map()));

    return res.json({
        progress: calculateProgress(user.roadmap, ratings),
        weeklyProgress: user.weeklyProgress,
        streak: user.streak,
        roadmap: user.roadmap
    });
};