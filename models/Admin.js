import pkg from "mongoose";
const { Schema: _Schema, model } = pkg;

const Schema = _Schema;

const AdminSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const Admin = model("Admin", AdminSchema);
export { Admin };
