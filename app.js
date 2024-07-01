import { fileURLToPath } from "url";
import { dirname, join } from "path";
import express, { static as staticc } from "express"; // Ensure express is imported correctly
import cors from "cors";
import cookieParser from "cookie-parser";
import parser from "body-parser";
const { json, urlencoded } = parser;
import mongoose from "mongoose";
const { connect } = mongoose;

import { MONGODB_URI } from "./configs/appConst.js";

/**
 * Middlewares
 */
import sourceAuth from "./middlewares/sourceCheck.js";
// Correct routes imports
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import musicRoutes from "./routes/musicRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());

// app.use(json({ extended: false }));
app.use(urlencoded({ limit: "100mb", extended: true, parameterLimit: 50000 }));
app.use(json({ limit: "100mb" }));

app.use(cookieParser());

app.use("/s3_musics", staticc(join(__dirname, "s3_musics")));
app.use("/s3_artworks", staticc(join(__dirname, "s3_artworks")));

app.use("/admin", adminRoutes);
app.use("/user", userRoutes);
app.use("/music", sourceAuth, musicRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

connect(MONGODB_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
})
  .then((result) => {
    const PORT = process.env.PORT || 8000;
    //print server port
    console.log(
      "Server running on port " + PORT + "Link: http://localhost:" + PORT
    );
    app.listen(PORT);
  })
  .catch((err) => console.log(err));
