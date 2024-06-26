import mongoose from "mongoose";

import { statSync, createReadStream } from "fs";
import { Plan } from "../models/plan.js";
import { Artist } from "../models/Artist.js";
import { Album } from "../models/Album.js";
import { Song } from "../models/Track.js";

/**
 * Artist
 */

export function topArtist(req, res, next) {
  Artist.find({
    genres: { $in: ["rock", "pop", "bollywood", "folk"] },
  })
    .populate("albums")
    .then((artist) => {
      res.status(200).json(artist);
    })
    .catch((err) => {
      res.status(404).json(err);
    });
}

export function getAlbumsByArtis(req, res, next) {
  const artistId = req.params.id;
  console.log(artistId);
  Artist.findById(artistId)
    .populate("albums")
    .then((artist) => {
      res.status(200).json(artist);
    })
    .catch((err) => {
      res.status(404).json(err);
    });
}

/**
 * ALBUMS
 */

export function topAlbums(req, res, next) {
  Album.find({
    genres: { $in: ["rock", "pop", "bollywood", "folk"] },
  })
    .populate("tracks")
    .populate("artist")
    .then((albums) => {
      res.status(200).json(albums);
    })
    .catch((err) => {
      res.status(404).json(err);
    });
}

export function getAlbumDetails(req, res, next) {
  const albumId = req.params.id;
  Album.findById(albumId)
    .populate("tracks")
    .populate("artist")
    .then((album) => {
      res.status(200).json(album);
    })
    .catch((err) => {
      err.statusCode = 500;
      next(err);
    });
}

export function getTrackDetails(req, res, next) {
  const trackId = req.params.id;
  Song.findById(trackId)
    .populate("album")
    .populate("artist")
    .then((track) => {
      res.status(200).json(track);
    })
    .catch((err) => {
      err.statusCode = 500;
      next(err);
    });
}

export async function playTrack(req, res, next) {
  const trackId = req.params.id;
  console.log(trackId);
  // Check if 'id' is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(trackId)) {
    console.log("Invalid ID format");
    return res.status(400).send({ message: "Invalid ID format" });
  }

  const track = await Song.findById(trackId);

  console.log(track);

  if (track?._id) {
    const path = "s3_musics/" + track.fileName;
    const stat = statSync(path);
    const fileSize = stat.size;
    const range = req.headers.range;
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = end - start + 1;
      const file = createReadStream(path, { start, end });

      const head = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Range": "bytes",
        "Content-Length": chunkSize,
        "Content-Type": "audio/mpeg",
      };

      res.writeHead(206, head);
      file.pipe(res);
    } else {
      res.status(404).json("Audio file Does not exist");
    }
  } else {
    res.status(404).json("Audio Does not exist");
  }
}

export async function addTrack(req, res, next) {
  console.log(req.body);
  const { name, artist, album, genres, duration, fileName } = req.body;
  const track = new Song({
    name,
    artist,
    album,
    genres,
    duration,
    fileName,
  });

  console.log(track);

  track
    .save()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
}
