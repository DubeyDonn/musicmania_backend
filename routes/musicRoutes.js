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
  allTracks,
  editTrack,
  deleteTrack,
} from "../controllers/musicController.js";

/**
 * Artist
 */
//All Artist
router.get("/allArtist", auth, allArtists);
// Top Artist list
router.get("/topArtist", auth, topArtist);
//ALL albums of Artist
router.get("/artist/:id", auth, getAlbumsByArtis);

/**
 * Albums
 */
router.get("/allAlbum", auth, allAlbums);
router.get("/topAlbum", auth, topAlbums);
router.get("/album/:id", auth, getAlbumDetails);

router.get("/allTrack", auth, allTracks);
router.get("/track/:id", auth, getTrackDetails);
router.put("/track/edit/:id", auth, editTrack);
router.delete("/track/delete/:id", auth, deleteTrack);

router.get("/play/:id", playTrack);

router.use("/", auth, (req, res, next) => {
  res.status(404).json({ message: "Not Found" });
});

export default router;
