import mongoose from "mongoose";

import { statSync, createReadStream } from "fs";
import { Plan } from "../models/plan.js";
import { Artist } from "../models/Artist.js";
import { Album } from "../models/Album.js";
import { Song } from "../models/Track.js";
import fs from "fs";
import { UserSongPlays } from "../models/UserSongPlays.js";
import { exit } from "process";
import axios from "axios";
import { recommendationUrl } from "../configs/appConst.js";

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
    genres: { $in: ["Rock", "Pop", "Bollywood", "Folk"] },
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
  // console.log(artistId);
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
      fs.unlinkSync("uploads/" + result.artworkImage);
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
    genres: { $in: ["Rock", "Pop", "Bollywood", "Folk"] },
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
      fs.unlinkSync("uploads/" + result.artworkImage);
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

  // console.log(trackId);
  // Check if 'id' is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(trackId)) {
    console.log("Invalid ID format");
    return res.status(400).send({ message: "Invalid ID format" });
  }

  const track = await Song.findById(trackId);

  // console.log(track);

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

      // Update user song plays
      if (req.user) {
        console.log("Updating user song plays");

        try {
          const userId = req.user._id;
          const userSongPlay = await UserSongPlays.findOne({
            user: userId,
            song: trackId,
          });
          // console.log(userSongPlay);
          if (userSongPlay) {
            userSongPlay.count += 1;
            await userSongPlay.save();
          } else {
            const newUserSongPlay = new UserSongPlays({
              user: userId,
              song: trackId,
              count: 1,
            });
            await newUserSongPlay.save();
          }
        } catch (err) {
          console.error("Error updating user song plays:", err);
        }
      }
    } else {
      res.status(404).json("Audio file Does not exist");
    }
  } else {
    res.status(404).json("Audio Does not exist");
  }
}

export async function recommendSongs(req, res, next) {
  // console.log("Recommend songs");

  //if user is not authenticated
  if (!req.user) {
    res.status(401).json("User is not authenticated");
    return;
  }
  const userId = req.user._id;

  try {
    // Call the Flask API
    const response = await axios.get(
      `${recommendationUrl}/recommend?user_id=${userId}`
    );

    // console.log(response.data);

    // Send the recommendations back to the client
    res.json(response.data);
  } catch (error) {
    console.error("Error calling recommendation API", error);
    res.status(500).send("Error fetching recommendations");
  }
}

export function getSongsByArtist(req, res, next) {
  const artistId = req.params.id;
  Song.find({ artist: artistId })
    .populate("album")
    .populate("artist")
    .then((tracks) => {
      res.status(200).json(tracks);
    })
    .catch((err) => {
      res.status(404).json(err);
    });
}

export function getSongsByAlbum(req, res, next) {
  const albumId = req.params.id;
  Song.find({ album: albumId })
    .populate("album")
    .populate("artist")
    .then((tracks) => {
      res.status(200).json(tracks);
    })
    .catch((err) => {
      res.status(404).json(err);
    });
}

// /search/hello
export function getSongsBySearch(req, res, next) {
  const searchTerm = req.params.q;
  const pipeline = [
    {
      $lookup: {
        from: "artists", // The collection to join with
        localField: "artist", // The field in the songs collection that refers to the artist ID
        foreignField: "_id", // The field in the artists collection that is the artist's ID
        as: "artist", // The name of the field to store artist
      },
    },
    {
      $unwind: "$artist", // Flatten the artist array
    },
    {
      $lookup: {
        from: "albums", // The collection to join with
        localField: "album", // The field in the songs collection that refers to the album ID
        foreignField: "_id", // The field in the albums collection that is the album's ID
        as: "album", // The name of the field to store album
      },
    },
    {
      $unwind: "$album", // Flatten the album array
    },
    {
      $match: {
        $or: [
          { name: { $regex: searchTerm, $options: "i" } }, // Match by song name (case-insensitive)
          { "artist.name": { $regex: searchTerm, $options: "i" } }, // Match by artist name (case-insensitive)
          { "album.name": { $regex: searchTerm, $options: "i" } }, // Match by album name (case-insensitive)
        ],
      },
    },
  ];

  // Execute the query using MongoDB aggregation
  mongoose.connection.db
    .collection("songs")
    .aggregate(pipeline)
    .toArray((err, songs) => {
      if (err) {
        return res.status(500).json({ message: "Error searching songs" });
      }

      // Send back the matched songs
      res.status(200).json(songs);
    });
}
