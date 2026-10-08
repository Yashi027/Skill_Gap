import jwt from "jsonwebtoken";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

const signToken = (id) => 
    jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES_IN || "7d"
    });

export const register = async (req,res) => {
    try {
        const {name,email,password} = req.body;
        if(!name || !email || !password){
            return res.status(400).json({success: false, message: "Valid credentials are required"});
        }
        if(password.length < 6){
            return res.status(400).json({success: false, message: "Password must be atleast 6 characters"});
        }
        const exist = await User.findOne({email: email.toLowerCase() });
        if(exist){
            return res.status(400).json({success: false, message: "An account with this mail is already registered"});
        }
        const hashedPassword = await bcrypt.hash(password,10);
        const user = await User.create({name, email, password: hashedPassword});
        const token = signToken(user._id);

        res.status(201).json({token, success: true, message: "User registered successfully", user: user.toProfileJSON()});
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: "Registration failed",error: error.message});
    }
}

export const login = async (req,res) => {
    try {
        const { email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({success: false, message: "Credentials required"});
        }
        const user = await User.findOne({email}).select("+password");
        if(!user){
            return res.status(401).json({success: false, message: "Invalid credentials"});
        }
        const matchedPassword = await bcrypt.compare(password,user.password)
        if(!matchedPassword){
            return res.status(401).json({success: false, message: "Incorrect Password"})
        }
        const token = signToken(user._id);
        res.json({token,message: "Login Successful" ,user: user.toProfileJSON()});
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: "Login failed",error: error.message});
    }
}

export const getMe = async (req, res) => {
  res.json({ user: req.user.toProfileJSON() });
};