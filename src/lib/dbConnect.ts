import mongoose from "mongoose";
// In Normal backend, the request to database is one time only and is running continuosly but in next js the connection is hitted only when requested and will hit again and again, so things should be made keeping that in mind

type connectionObject = {
  isConnected?: number; //Will Return tgis if we connect to database
};

const connection: connectionObject = {}; // we can keep it empty because we used optional i.e ? in type defining

async function dbConnect(): Promise<void> {
  //Void in ts is different, void means it can be of anytype in ts

  if (connection.isConnected) {
    console.log("Db Already connected");
    return;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {
    });
    connection.isConnected = db.connections[0].readyState; //To store num after connetion for optimization
    console.log("DB Connection Successfully");
  } catch (error) {
    console.log("Error Occurred while db connection", error);
    }
}

export default dbConnect;