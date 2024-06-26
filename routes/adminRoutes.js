import { Router } from "express";
const router = Router();

import {
  newPlan,
  newArtist,
  newAlbum,
  newTrack,
} from "../controllers/adminController.js";

router.post("/login");
router.post("/new-plan", newPlan);
router.post("/artist", newArtist);
router.post("/album", newAlbum);
router.post("/track", newTrack);

export default router;
