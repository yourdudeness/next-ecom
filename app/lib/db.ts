import mongoose from "mongoose";

let connection: typeof mongoose | null = null;

const url = "mongodb://127.0.0.1:27017/next_ecom";

const startDb = async () => {
  try {
    if (!connection) {
      connection = await mongoose.connect(url);
    }
    return connection;
  } catch (error) {
    // throw new Error((error as any).message || 'error conection')
    console.log(error)
  }
};

export default startDb;
