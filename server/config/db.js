import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected");
    } catch (error) {
        console.log(`MongoDB connection error: ${error.message}`);
        throw error;
    }
}

export default connectDB;