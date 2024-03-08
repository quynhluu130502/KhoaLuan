import mongoose from "mongoose";

function connectDatabase() {
  let mongoString: string = "";
  if (process.env.NODE_ENV === "development") {
    mongoString = process.env.DATABASE_URL_DEV!;
  } else {
    mongoString = process.env.DATABASE_URL_PROD!;
  }
  mongoose.connect(mongoString);
  const database = mongoose.connection;
  database.on("error", (error: any) => {
    console.log(error);
  });
  database.once("connected", () => {
    console.log(`${process.env.NODE_ENV} Database Connected`);
  });
}
export default connectDatabase;
