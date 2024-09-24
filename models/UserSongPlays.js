import pkg from "mongoose";
const { Schema: _Schema, model } = pkg;

const Schema = _Schema;

const UserSongPlaysSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  song: {
    type: Schema.Types.ObjectId,
    ref: "Song",
    required: true,
  },
  count: {
    type: Number,
    default: 0,
  },
});

const UserSongPlays = model("UserSongPlays", UserSongPlaysSchema);
export { UserSongPlays };
