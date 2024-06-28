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

router.post("/login", login);
router.post("/new-plan", auth, newPlan);
router.post("/artist", auth, newArtist);
router.post("/album", auth, newAlbum);
router.post("/track", auth, newTrack);

export default router;
