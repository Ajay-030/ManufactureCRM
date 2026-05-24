import mongoose from 'mongoose';

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/manufacturecrm';
  
  try {
    const conn = await mongoose.connect(mongoUri);
    console.log(`\x1b[32m[Database] MongoDB Connected: ${conn.connection.host}\x1b[0m`);
    global.useMockDb = false;
  } catch (error) {
   console.error(error);
  console.error(`\x1b[31m[Database Error] Failed to connect to MongoDB at ${mongoUri}\x1b[0m`);
    console.warn('\x1b[33m[Database Warning] Please make sure MongoDB is installed and running locally, or configure MONGO_URI in a .env file.\x1b[0m');
    console.warn('\x1b[36m[Failsafe Mode] MongoDB not detected. Starting server in IN-MEMORY MOCK DATABASE MODE! All operations will load and save perfectly in-memory.\x1b[0m');
    global.useMockDb = true;
  }
};

export default connectDB;
