import * as mongoose from "mongoose";

let ncDetailSchema = new mongoose.Schema({
  id: {
    type: String,
    required: false,
  },
  ncType: {
    type: String,
    required: false,
  },
  detectedByUnit: {
    type: String,
    required: false,
  },
  detectionDate: {
    type: Date,
    required: false,
  },
  problemTitle: {
    type: String,
    required: false,
  },
  problemDescription: {
    type: String,
    required: false,
  },
  attachment: {
    type: Array,
    required: false,
  },
  contaiment: {
    type: String,
    required: false,
  },
  projectNumber: {
    type: String,
    required: false,
  },
  projectName: {
    type: String,
    required: false,
  },
  defectiveQuantity: {
    type: Number,
    required: false,
  },
  defectiveUnit: {
    type: String,
    required: false,
  },
  productType: {
    type: String,
    required: false,
  },
  device: {
    type: String,
    required: false,
  },
  symptomCodeL0: {
    type: String,
    required: false,
  },
  symptomCodeL1: {
    type: String,
    required: false,
  },
  locationWhereDetected: {
    type: String,
    required: false,
  },
  phaseDetection: {
    type: String,
    required: false,
  },
  dueDate: {
    type: Date,
    required: false,
  },
  impact: {
    type: String,
    required: false,
  },
  priority: {
    type: String,
    required: false,
  },
  validator: {
    type: String,
    required: false,
  },
  assignedDepartment: {
    type: String,
    required: false,
  },
  stage: {
    type: Number,
    required: false,
  },
  __v: { type: Number, select: false },
});

ncDetailSchema.pre("save", async function (next) {
  if (this.isNew) {
    let year = new Date().getFullYear();
    let id = "NC-2" + Math.floor(Math.random() * 100000000);
    while (await mongoose.models.NCDetail.findOne({ id: id })) {
      id = "NC-2" + Math.floor(Math.random() * 100000000);
    }
    this.id = id;
    next();
  } else {
    next();
  }
});

export default mongoose.model("NCDetail", ncDetailSchema, "NCDetail");
