import { Router } from "express";
const router = Router();
import auth from "../middlewares/authCheck.js";

import {
  topArtist,
  getAlbumsByArtis,
  topAlbums,
  getAlbumDetails,
  getTrackDetails,
  playTrack,
  allArtists,
  allAlbums,
} from "../controllers/musicController.js";

/**
 * Artist
 */
//All Artist
router.get("/artist", auth, allArtists);
// Top Artist list
router.get("/topArtist", auth, topArtist);
//ALL albums of Artist
router.get("/artist/:id", auth, getAlbumsByArtis);

/**
 * Albums
 */
router.get("/album", auth, allAlbums);
router.get("/topAlbum", auth, topAlbums);
router.get("/album/:id", auth, getAlbumDetails);

router.get("/track/:id", auth, getTrackDetails);
router.get("/play/:id", playTrack);

router.use("/", auth, (req, res, next) => {
  res.status(404).json({ message: "Not Found" });
});

export default router;
