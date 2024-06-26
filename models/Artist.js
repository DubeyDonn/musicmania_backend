import pkg from "mongoose";
const { Schema: _Schema, model } = pkg;

const Schema = _Schema;

const ArtistSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  genres: {
    type: String,
  },
  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  albums: [
    {
      type: Schema.Types.ObjectId,
      ref: "Album",
    },
  ],
  image: {
    type: String,
  },
  popularity: {
    type: Number,
  },
});

ArtistSchema.methods.addAlbum = function (album) {
  this.albums.push(album);
  return this.save();
};

const Artist = model("Artist", ArtistSchema);

export { Artist };
