import { Router } from "express";
const router = Router();
import { body } from "express-validator";
import {
  onSignup,
  onLogin,
  onForgotPassword,
  onViewProfile,
  viewPlaylist,
  addToPlaylist,
  removePlaylist,
} from "../controllers/userController.js";
import {
  viewPlans,
  onSubscribePlan,
  onUnsubscribePlan,
} from "../controllers/membershipController.js";
import auth from "../middlewares/authCheck.js";

/**
 * Middleware
 */
import { User } from "../models/user.js";

/**
 * User Access
 */
router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please Enter a valid email ID")
      .custom((value, req) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("Email already Exist");
          }
        });
      })
      .normalizeEmail(),
    body("password")
      .trim()
      .isLength({ min: 6 })
      .withMessage("Your password whould have to atlest 6 Character long"),
  ],
  onSignup
);

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please Enter a valid email ID")
      .normalizeEmail(),
    body("password")
      .trim()
      .isLength({ min: 6 })
      .withMessage("Please Enter a Valid Password!"),
  ],
  onLogin
);

router.post("/forgot", onForgotPassword);

//View Profiles
router.get("/profile", auth, onViewProfile);

/**
 * Public Contents
 */

router.get("/plans", viewPlans);

router.put("/subscribe/:id", auth, onSubscribePlan);

router.put("/unsubscribe", auth, onUnsubscribePlan);

/**
 * Private Contents
 */
router.get("/play-list", auth, viewPlaylist);

router.put("/play-list/:id", auth, addToPlaylist);

router.delete("/play-list/:id", auth, removePlaylist);

/**
 * Handle Error
 */
router.use("/", (req, res, next) => {
  const newErr = Error("Please Login to access User Resources");
  newErr.statusCode = 403;
  next(newErr);
});

export default router;
