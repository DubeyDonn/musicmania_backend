import pkg from "mongoose";
const { Schema: _Schema, model } = pkg;

const Schema = _Schema;

const planSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  planType: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  features: {
    type: [String],
  },
  price: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    default: "plan",
  },
});

const Plan = model("Plan", planSchema);
export { Plan };
