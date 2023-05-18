import mongoose from "mongoose";
console.log(process.env.MONGO_URI);
export const connectDB = async () => {
  const { connection } = await mongoose.connect(process.env.MONGO_URI);
  console.log(`MongoDB Connected with ${connection.host}`);
};
