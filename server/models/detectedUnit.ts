import * as mongoose from "mongoose";

let detectedUnitSchema = new mongoose.Schema({
  unitId: {
    type: String,
    required: true,
    unique: true,
  },
  subBusiness: {
    type: String,
    required: true,
  },
  unitCode: {
    type: String,
    required: true,
  },
  unitName: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  __v: { type: Number, select: false },
});

export default mongoose.model("DetectedUnit", detectedUnitSchema,"DetectedUnit");
