const express = require("express");

const {
    getMovies,
    getMovieById,
    watchMovie,
    createMovie,
    updateMovie,
    deleteMovie,
} = require("../controllers/movieController");

const protect = require("../middlewares/authMiddleware");
const admin = require("../middlewares/adminMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

router.get("/", getMovies);

router.get(
    "/:id/watch",
    protect,
    watchMovie
);

router.get("/:id", getMovieById);

router.post("/", protect, admin, upload, createMovie);

router.put("/:id", protect, admin, upload, updateMovie);

router.delete("/:id", protect, admin, deleteMovie);

module.exports = router;