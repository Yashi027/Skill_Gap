import { generateRoadmap, calculateProgress } from "../utils/roadmap";

export const setCareer = async(req,res) => {
    try {
        const {selectedCareer} = req.body;
        const allowed = ["","frontend","backend","fullstack"];
        if(!allowed.includes(selectedCareer)){
            return res.status(400).json({message:"Select valid career path"});
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
        return res.status(500).json({success: false, message: error.message});
    }
}

export const updateSkillRatings = async(req,res) => {
    try {
        
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({success: false, message: error.message});
    }
}

export const getProgress = async(req,res) => {
    const user = req.user;
    const ratings = Object.fromEntries(user.skillRatings || new Map());

    return res.json({
        progress: calculateProgress(user.roadmap, ratings),
        weeklyProgress: user.weeklyProgress,
        streak: user.streak,
        roadmap: user.roadmap
    });
};