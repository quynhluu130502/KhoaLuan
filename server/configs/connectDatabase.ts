import mongoose from "mongoose";

let mongoString: string = "";
if (process.env.NODE_ENV === "development") {
  mongoString = process.env.DATABASE_URL_DEV!;
} else {
  mongoString = process.env.DATABASE_URL_PROD!;
}

const connectDatabase = () => {
  try {
    mongoose.connect(mongoString, {
      serverSelectionTimeoutMS: 30000,
    });
    const database = mongoose.connection;
    database.on("connecting", function () {
      console.log("Started connecting to MongoDB");
    });
    database.on("error", (error: any) => {
      console.error("Error in MongoDb connection: " + error);
      mongoose.disconnect();
    });
    database.on("connected", () => {
      console.log(`${process.env.NODE_ENV} Database Connected`);
    });
    database.once("open", function () {
      console.log("MongoDB connection opened!");
    });
    database.on("reconnected", function () {
      console.log("MongoDB reconnected!");
    });
    database.on("disconnected", function () {
      console.log("MongoDB disconnected!");
    });
  } catch (error) {
    console.log(error);
  }
};
export default connectDatabase;
