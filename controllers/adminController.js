import { Plan } from "../models/plan.js";
import { Artist } from "../models/Artist.js";
import { Album } from "../models/Album.js";
import { Song } from "../models/Track.js";
import { Admin } from "../models/Admin.js";
import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import { APP_KEY } from "../configs/appConst.js";

const { sign } = jsonwebtoken;
const { compare } = bcryptjs;

export function login(req, res, next) {
  const { username, password } = req.body;
  console.log(username, password);
  let loginAdmin;
  Admin.findOne({ username: username })
    .then((admin) => {
      if (!admin) {
        const error = new Error("User not found!");
        error.statusCode = 404;
        throw error;
      }
      loginAdmin = admin;
      return compare(password, admin.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error("Wrong Password!");
        error.statusCode = 401;
        throw error;
      }
      const token = sign(
        {
          username: username,
          adminId: loginAdmin._id.toString(),
          userType: "admin",
        },
        APP_KEY,
        { expiresIn: "1d" }
      );
      res
        .status(200)
        .json({ token: token, adminId: loginAdmin._id.toString() });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
}

/**
 * Controller Functions
 */
export function newPlan(req, res, next) {
  const { title, planType, description, features, price } = req.body;

  let plan = new Plan({
    title: title,
    planType: planType,
    description: description,
    features: features,
    price: price,
  });

  plan
    .save()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(503).json(err);
    });
}

export function newArtist(req, res, next) {
  const { name, genres } = req.body;
  const image = req.file.filename;
  const artist = new Artist({
    name: name,
    genres: genres,
    followers: [],
    albums: [],
    image: image,
    popularity: 0,
  });
  artist
    .save()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(503).json(err);
    });
}

export function newAlbum(req, res, next) {
  const { artistId, name, genres } = req.body;
  const image = req.file.filename;

  let currentArtist;
  Artist.findById(artistId)
    .then((artist) => {
      currentArtist = artist;
      let album = new Album({
        name: name,
        genres: genres,
        image: image,
        tracks: [],
        artist: artist,
      });
      return album.save();
    })
    .then((album) => {
      return currentArtist.addAlbum(album);
    })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(503).json(err);
    });
}

export function newTrack(req, res, next) {
  const { albumId, name, duration, artworkImage, language } = req.body;
  const fileName = req.file.filename;
  let currentAlbum;
  Album.findById(albumId)
    .populate("artist")
    .then((album) => {
      currentAlbum = album;
      const track = new Song({
        name: name,
        album: album,
        artist: album.artist,
        duration: duration,
        artworkImage: artworkImage,
        popularity: 0,
        language: language,
        fileName: fileName,
      });
      return track.save();
    })
    .then((track) => {
      return currentAlbum.addTrack(track);
    })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(503).json(err);
    });
}
