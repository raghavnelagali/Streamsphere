const express = require("express");

const upload = require("../middlewares/uploadMiddleware");
const protect = require("../middlewares/authMiddleware");
const admin = require("../middlewares/adminMiddleware");

const {
    uploadMovieMedia,
} = require("../controllers/uploadController");

const router = express.Router();

router.post(
    "/movie",
    protect,
    admin,
    upload,
    uploadMovieMedia
);

module.exports = router;