import mongoose from "mongoose";

import { statSync, createReadStream } from "fs";
import { Plan } from "../models/plan.js";
import { Artist } from "../models/Artist.js";
import { Album } from "../models/Album.js";
import { Song } from "../models/Track.js";
import fs from "fs";

/**
 * Artist
 */

export function allArtists(req, res, next) {
  Artist.find()
    .populate("albums")
    .then((artists) => {
      res.status(200).json(artists);
    })
    .catch((err) => {
      res.status(404).json(err);
    });
}

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

export function getAlbumsByArtist(req, res, next) {
  const artistId = req.params.id;
  console.log(artistId);
  Artist.findById(artistId)
    .populate("albums")
    .then((artist) => {
      artist.popularity += 1;
      artist.save();
      res.status(200).json(artist);
    })
    .catch((err) => {
      res.status(404).json(err);
    });
}

export function editArtist(req, res, next) {
  const artistId = req.params.id;
  const { name, genres } = req.body;
  Artist.findById(artistId)
    .then((artist) => {
      artist.name = name;
      artist.genres = genres;
      return artist.save();
    })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(503).json(err);
    });
}

export function deleteArtist(req, res, next) {
  const artistId = req.params.id;
  Artist.findByIdAndDelete(artistId)
    .then((result) => {
      //unlink the image
      fs.unlinkSync("uploads/" + result.image);
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(503).json(err);
    });
}

/**
 * ALBUMS
 */
export function allAlbums(req, res, next) {
  Album.find()
    .populate("tracks")
    .populate("artist")
    .then((albums) => {
      res.status(200).json(albums);
    })
    .catch((err) => {
      res.status(404).json(err);
    });
}

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

export function editAlbum(req, res, next) {
  const albumId = req.params.id;
  const { name, genres } = req.body;
  Album.findById(albumId)
    .then((album) => {
      album.name = name;
      album.genres = genres;
      return album.save();
    })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(503).json(err);
    });
}

export function deleteAlbum(req, res, next) {
  const albumId = req.params.id;
  Album.findByIdAndDelete(albumId)
    .then((result) => {
      //unlink the image
      fs.unlinkSync("uploads/" + result.image);
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(503).json(err);
    });
}

/**
 * Tracks
 */
export function allTracks(req, res, next) {
  Song.find()
    .populate("album")
    .populate("artist")
    .then((tracks) => {
      res.status(200).json(tracks);
    })
    .catch((err) => {
      res.status(404).json(err);
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

export function editTrack(req, res, next) {
  const trackId = req.params.id;
  const { name, duration, language } = req.body;
  Song.findById(trackId)
    .then((track) => {
      track.name = name;
      track.duration = duration;
      track.language = language;
      return track.save();
    })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(503).json(err);
    });
}

export function deleteTrack(req, res, next) {
  const trackId = req.params.id;
  Song.findByIdAndDelete(trackId)
    .then((result) => {
      //unlink the file
      fs.unlinkSync("musics/" + result.fileName);
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(503).json(err);
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
    const path = "musics/" + track.fileName;
    const stat = statSync(path);
    const fileSize = stat.size;
    const range = req.headers.range ? req.headers.range : "bytes=0-";

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
