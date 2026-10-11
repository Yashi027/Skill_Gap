import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log("Database Connected"))
        await mongoose.connect(`${process.env.MONGO_URI}/skillgap`);
    } catch (error) {
        console.log(`MongoDB connection error: ${error.message}`);
        throw error;
    }
}

export default connectDB;