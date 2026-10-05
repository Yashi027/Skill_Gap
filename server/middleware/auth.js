import jwt from "jsonwebtoken";
import User from "../models/User.js";


const protect = async(req,res,next) => {
    try {
        const header = req.headers.authorization || "";
        const token = header.startsWith("Bearer ") ? header.split(" ")[1] : null;
        if(!token){
            return res.status(401).json({message: "Not authorized, no token"});
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if(!user){
            return res.status(404).json({message: "Not authorized"});
        }
        req.user = user;
        next();
    } catch (error) {
        console.log(error.message)
        return res.status(401).json({success: false, message: "Not authorised, invalid token"});
    }
}

export default protect;