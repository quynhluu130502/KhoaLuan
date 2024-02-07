import * as mongoose from "mongoose";

let userSchema = new mongoose.Schema({
  sso: {
    type: Number,
    unique: true,
    min: 100000,
    max: 999999,
    validate: {
      validator: function (value: any) {
        return /^[1-9]\d{5}$/.test(value);
      },
      message: (props: any) => `${props.value} is not a valid SSO number!`,
    },
    minlength: 6,
    maxlength: 6,
  },
  name: {
    required: true,
    type: String,
  },
  email: {
    required: true,
    type: String,
  },
  language: {
    required: true,
    type: String,
    default: "English",
  },
  job_function: {
    required: false,
    type: String,
    default: "",
  },
  role: {
    required: false,
    type: String,
    default: "User",
  },
  application: {
    required: false,
    type: Array,
    default: ["NC"],
  },
  last_login: {
    required: true,
    type: String,
    default: Date.now(),
  },
  pass: { type: String, required: true },
  salt: { type: String, required: true },
  active: { type: Boolean, required: true, default: true },
  accessToken: { type: String, required: false },
  refreshToken: { type: String, required: false },
  __v: { type: Number, select: false },
});

userSchema.pre("save", async function (next) {
  if (this.isNew) {
    const maxSSO = await mongoose.models.User.find().sort("-sso").limit(1);
    let newSSO;
    if (maxSSO.length > 0 && maxSSO[0].sso) {
      newSSO = maxSSO[0].sso + 1;
    } else {
      newSSO = 100000;
    }
    if (newSSO > 999999) {
      next(new Error("SSO limit reached"));
    } else {
      this.sso = newSSO;
      next();
    }
  } else {
    next();
  }
});

export default mongoose.model("User", userSchema, "User");
