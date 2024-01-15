import mongoose from "mongoose";

function connectDatabase() {
  const mongoString: string = process.env.DATABASE_URL!;
  mongoose.connect(mongoString);
  const database = mongoose.connection;
  database.on("error", (error: any) => {
    console.log(error);
  });
  database.once("connected", () => {
    console.log("Database Connected");
  });
}
export default connectDatabase;