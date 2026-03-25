import mongoose from 'mongoose';
import colors from 'colors';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // Using modern template literals with colors
    console.log(colors.cyan.underline(`MongoDB Connected: ${conn.connection.host}`));
    
  } catch (error) {
    // Colors make errors much easier to spot in your VS Code terminal
    console.error(colors.red.bold(`Error: ${error.message}`));
    process.exit(1);
  }
};

export default connectDB;