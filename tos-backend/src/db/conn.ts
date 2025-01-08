// import mongoose from "mongoose";


// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI as string);
//     console.log("database is connected!")
//   } catch (error) {
//     console.log(error)
//     process.exit(1)
//   }
// }

// export default connectDB;


import mongoose from 'mongoose';

const connectDB = async () => {
  if (process.env.NODE_ENV === 'test') {
    console.log("Test environment detected. Skipping real DB connection.");
    return;
  }
  await mongoose.connect(process.env.DB_URL || 'mongodb://127.0.0.1:27017/mydb');
};

export default connectDB;
