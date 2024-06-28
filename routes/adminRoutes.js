import { Router } from "express";
const router = Router();

import {
  newPlan,
  newArtist,
  newAlbum,
  newTrack,
  login,
} from "../controllers/adminController.js";
import auth from "../middlewares/adminAuthCheck.js";
import upload from "../middlewares/saveFile.js";

router.post("/login", login);
router.post("/new-plan", auth, upload.single("image"), newPlan);
router.post("/artist", auth, upload.single("image"), newArtist);
router.post("/album", auth, upload.single("image"), newAlbum);
router.post("/track", auth, upload.single("songFile"), newTrack);

export default router;
