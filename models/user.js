import pkg from "mongoose";
const { Schema: _Schema, model } = pkg;

const Schema = _Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  membership: {
    type: Schema.Types.ObjectId,
    ref: "Plan",
  },
  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  playlist: [
    {
      type: Schema.Types.ObjectId,
      ref: "Track",
    },
  ],
  language: [String],
  membershipStartDate: {
    type: Date,
  },
  membershipEndDate: {
    type: Date,
  },

  type: {
    type: String,
    default: "user",
  },
});

const User = model("User", UserSchema);
export { User };
