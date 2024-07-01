import pkg from "mongoose";
const { Schema: _Schema, model } = pkg;

const Schema = _Schema;

const AlbumSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  genres: {
    type: String,
  },
  image: {
    type: String,
  },
  tracks: [
    {
      type: Schema.Types.ObjectId,
      ref: "Song",
    },
  ],
  artist: {
    type: Schema.Types.ObjectId,
    ref: "Artist",
  },
});

AlbumSchema.methods.addTrack = function (track) {
  this.tracks.push(track);
  return this.save();
};

const Album = model("Album", AlbumSchema);
export { Album };
