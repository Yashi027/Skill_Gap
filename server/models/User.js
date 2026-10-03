import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const roadmapItemSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    difficulty:{
        type: String,
        enum: ["Beginner","Intermediate","Advanced"]
    },
    priority:{
        type: String,
        enum: ["High","Medium","Low"]
    }
},{_id: false});

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        trim: true,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password:{
        type: String,
        required: true,
        minlength: 6,
        select: false
    },
    githubUsername:{
        type: String,
        default: ""
    },
    selectedCareer: {
        type: String,
        enum: ["", "frontend","backend","fullstack"],
        default: ""
    },
    skillRatings:{
        type: Map,
        of: Number,
        default: {}
    },
    roadmap: {
        type: [roadmapItemSchema],
        default:[]
    },
    weeklyProgress: {
        type: [Number],
        default: () => Array(7).fill(0)
    },
    streak:{
        type: Number,
        default: 0
    },
    githubData:{
        type: mongoose.Schema.Types.Mixed,
        default: null
    },
    skillEvidence:{
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    skillVerification:{
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
},{timestamps: true})

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toProfileJSON = function () {
    const profile = this.toObject({ flattenMaps: true });
    delete profile.password;
    delete profile.__v;
    return profile;
};

export default mongoose.model("User", userSchema);
