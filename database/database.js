import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.MONGO_URI, {
      dbName: "vbazar",
    });
    console.log(`Database connected with ${connection.host}`);
  } catch (error) {
    console.log(error.message);
  }
};

export default connectDB;
