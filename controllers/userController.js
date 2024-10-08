import mongoose from "mongoose";
import jsonwebtoken from "jsonwebtoken";
const { sign } = jsonwebtoken;
import { validationResult } from "express-validator";
import bcryptjs from "bcryptjs";
const { hash, compare } = bcryptjs;
import { APP_KEY } from "../configs/appConst.js";

import { User } from "../models/user.js";
import { Song } from "../models/Track.js";

/**
 * Public Access
 */
export function onSignup(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const err = new Error("Validation Erro");
    err.statusCode = 422;
    err.data = errors.array();
    throw err;
  }

  const { email, password, name } = req.body;

  hash(password, 12)
    .then((hashPassword) => {
      const user = new User({
        email: email,
        name: name,
        password: hashPassword,
        phone: null,
        membership: null,
        membershipStartDate: null,
        membershipEndDate: null,
        playlist: [],
      });

      return user.save();
    })
    .then((result) => {
      res.status(201).json({ msg: "Signup Successfully!", userId: result._id });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
}

export function onForgotPassword(req, res, next) {}

export function onLogin(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const err = new Error("Validation Erro");
    err.statusCode = 422;
    err.data = errors.array();
    throw err;
  }

  let email = req.body.email;
  let password = req.body.password;
  let loginUser = null;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        const err = new Error("User Does not exist with the provided email ID");
        err.statusCode = 401;
        throw err;
      }
      loginUser = user;
      return compare(password, user.password);
    })
    .then((result) => {
      if (!result) {
        const err = new Error("Password does not match!");
        err.statusCode = 401;
        throw err;
      }

      const token = sign(
        { userId: loginUser._id.toString(), email: loginUser.email },
        APP_KEY,
        { expiresIn: "90d" }
      );

      res.status(200).json({ token: token, userId: loginUser._id.toString() });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
}

/**
 * Private Access
 */

export function onViewProfile(req, res, next) {
  const userId = req.userId;
  User.findById(userId)
    .populate("membership")
    .populate("playlist")
    .select("-password")
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
}

export function viewPlaylist(req, res, next) {
  const userId = req.userId;
  User.findById(userId)
    .populate("playlist")
    .then((movies) => {
      res.json(movies.playlist);
    })
    .catch((err) => {
      console.log(err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
}

export function addToPlaylist(req, res, next) {
  const userId = req.userId;
  const trackId = req.params.id;
  let currentUser;
  User.findById(userId)
    .populate("playlist")
    .then((user) => {
      currentUser = user;
      return Song.findById(trackId);
    })
    .then((track) => {
      currentUser.playlist.push(track);
      return currentUser.save();
    })
    .then((result) => {
      res.status(200).json(result.playlist);
    })
    .catch((err) => {
      console.log(err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
}

export function removePlaylist(req, res, next) {
  const userId = req.userId;
  const trackId = req.params.id;
  User.findById(userId)
    .populate("playlist")
    .then((user) => {
      user.playlist.remove(trackId);
      return user.save();
    })
    .then((result) => {
      res.status(200).json(result.playlist);
    })
    .catch((err) => {
      console.log(err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
}
