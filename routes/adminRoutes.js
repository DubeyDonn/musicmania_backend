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
router.post("/addPlan", auth, upload.single("image"), newPlan);
router.post("/addArtist", auth, upload.single("image"), newArtist);
router.post("/addAlbum", auth, upload.single("image"), newAlbum);
router.post("/addTrack", auth, upload.single("songFile"), newTrack);

export default router;
