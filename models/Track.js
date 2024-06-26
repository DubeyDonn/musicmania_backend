import pkg from "mongoose";
const { Schema: _Schema, model } = pkg;

const Schema = _Schema;

const SongSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  album: {
    type: Schema.Types.ObjectId,
    ref: "Album",
  },
  artist: {
    type: Schema.Types.ObjectId,
    ref: "Artist",
  },
  duration: {
    type: Number,
  },
  artworkImage: {
    type: String,
  },
  popularity: {
    // like
    type: Number,
  },
  language: {
    type: String,
  },
  fileName: {
    type: String,
  },
});

const Song = model("Song", SongSchema);
export { Song };
