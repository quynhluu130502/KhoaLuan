import * as mongoose from "mongoose";

let ncDetailSchema = new mongoose.Schema({
  problemDescription:{
    type:{
      description:{
        type:String,
        required:true
      },
      attachment:{
        type:Array,
        required:false
      }
    },
    required:true
  },
  __v: { type: Number, select: false },
});

export default mongoose.model("NCDetail", ncDetailSchema,"NCDetail");
