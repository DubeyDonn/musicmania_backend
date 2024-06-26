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
  addTrack,
} from "../controllers/musicController.js";

/**
 * Artist
 */
// ALL Artist list
router.get("/artist", auth, topArtist);
//ALL albums of Artist
router.get("/artist/:id", auth, getAlbumsByArtis);

/**
 * ALL Albums
 */
router.get("/album", auth, topAlbums);
router.get("/album/:id", auth, getAlbumDetails);

router.post("/track", auth, addTrack);
router.get("/track/:id", auth, getTrackDetails);
router.get("/play/:id", auth, playTrack);

router.use("/", auth, topAlbums);

export default router;
