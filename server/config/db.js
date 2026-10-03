import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error("MONGO_URI is not set.");
        }

        await mongoose.connect(mongoUri);
        console.log("Database connected");
    } catch (error) {
        console.log(`MongoDB connection error: ${error.message}`);
        throw error;
    }
}

export default connectDB;
