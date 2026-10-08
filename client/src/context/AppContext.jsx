import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import api from "../api/client";

export const AppContext = createContext();

export const AppProvider = ({children}) => {
    const {user, setUser, isAuthenticated} = useContext(AuthContext);
    const [progress, setProgress] = useState(0);

    const selectedCareer = user?.selectedCareer || "";
    const skillRatings = user?.skillRatings || {};
    const roadmap = user?.roadmap || [];
    const weeklyProgress = user?.weeklyProgress || Array(7).fill(0);
    const streak = user?.streak || 0;
    const githubData = user?.githubData || null;
    const skillVerification = user?.skillVerification || {};

    useEffect(() => {
        if(roadmap.length > 0){
            const completed = roadmap.filter((item) => skillRatings[item.name] === 5).length;
            setProgress(Math.round((completed/roadmap.length)*100));
        }else{
            setProgress(0);
        }
    },[roadmap,skillRatings]);

    const setSelectedCareer = async (career) => {
        if(!isAuthenticated)
            return;
        const data = await api("/profile/career",{
            method: "PATCH",
            body:{ selectedCareer: career}
        });
        setUser(data.user);
    }

    const setSkillRatings = async (newRatings) => {
        if(!isAuthenticated)
            return;
        const data = await api("/profile/skills",{
            method: "PATCH",
            body : {
                skillRatings: newRatings
            }
        })
        setUser(data.user);
    }

    const fetchGithubData = async (username) => {
        if(!isAuthenticated){
            throw new Error("Please log in first.");
        }
        const data = await api(`/github/${encodeURIComponent(username)}`);
        setUser(data.user);
        return data.user.githubData;
    }

    return(
        <AppContext.Provider 
        value={{
            selectedCareer,
            skillRatings,
            githubData,
            skillVerification,
            roadmap,
            progress,
            weeklyProgress,
            streak,
            fetchGithubData,
            setSelectedCareer,
            setSkillRatings
        }}>
            {children}
        </AppContext.Provider>
    )
}