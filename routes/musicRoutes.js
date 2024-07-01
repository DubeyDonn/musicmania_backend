import { Router } from "express";
const router = Router();
import auth from "../middlewares/authCheck.js";

import {
  topArtist,
  topAlbums,
  getAlbumDetails,
  getTrackDetails,
  playTrack,
  allArtists,
  allAlbums,
  allTracks,
  editTrack,
  deleteTrack,
  getAlbumsByArtist,
  editArtist,
  deleteArtist,
  editAlbum,
  deleteAlbum,
} from "../controllers/musicController.js";
import adminAuthCheck from "../middlewares/adminAuthCheck.js";

/**
 * Artist
 */
router.get("/allArtist", auth, allArtists);
router.get("/topArtist", auth, topArtist);
router.get("/artist/:id", auth, getAlbumsByArtist);
router.put("/artist/edit/:id", adminAuthCheck, editArtist);
router.delete("/artist/delete/:id", adminAuthCheck, deleteArtist);

/**
 * Albums
 */
router.get("/allAlbum", auth, allAlbums);
router.get("/topAlbum", auth, topAlbums);
router.get("/album/:id", auth, getAlbumDetails);
router.put("/album/edit/:id", adminAuthCheck, editAlbum);
router.delete("/album/delete/:id", adminAuthCheck, deleteAlbum);

/**
 * Tracks
 */
router.get("/allTrack", auth, allTracks);
router.get("/track/:id", auth, getTrackDetails);
router.put("/track/edit/:id", adminAuthCheck, editTrack);
router.delete("/track/delete/:id", adminAuthCheck, deleteTrack);
router.get("/play/:id", playTrack);

router.use("/", auth, (req, res, next) => {
  res.status(404).json({ message: "Not Found" });
});

export default router;
