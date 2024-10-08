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
  recommendSongs,
  getSongsByArtist,
  getSongsByAlbum,
  getSongsBySearch,
} from "../controllers/musicController.js";
import adminAuthCheck from "../middlewares/adminAuthCheck.js";
import { authenticateJWT } from "../middlewares/authenticateJWT.js";

/**
 * Artist
 */
router.get("/allArtist", allArtists);
router.get("/topArtist", topArtist);
router.get("/artist/:id", getAlbumsByArtist);
router.put("/artist/edit/:id", adminAuthCheck, editArtist);
router.delete("/artist/delete/:id", adminAuthCheck, deleteArtist);

/**
 * Albums
 */
router.get("/allAlbum", allAlbums);
router.get("/topAlbum", topAlbums);
router.get("/album/:id", getAlbumDetails);
router.put("/album/edit/:id", adminAuthCheck, editAlbum);
router.delete("/album/delete/:id", adminAuthCheck, deleteAlbum);

/**
 * Tracks
 */
router.get("/allTrack", allTracks);
router.get("/track/:id", getTrackDetails);
router.put("/track/edit/:id", adminAuthCheck, editTrack);
router.delete("/track/delete/:id", adminAuthCheck, deleteTrack);
router.get("/play/:id", authenticateJWT, playTrack);

router.get("/tracks/artist/:id", getSongsByArtist);

router.get("/tracks/album/:id", getSongsByAlbum);

router.get("/search/:q", getSongsBySearch);

/**
 * Recommend by User
 */
router.get("/recommend", authenticateJWT, recommendSongs);

router.use("/", (req, res, next) => {
  res.status(404).json({ message: "Not Found" });
});

export default router;
