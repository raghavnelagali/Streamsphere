const path = require("path");
const multer = require("multer");
const AppError = require("../utils/AppError");

const storage = multer.memoryStorage();

const allowedImages = [
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
];

const allowedVideos = [
    ".mp4",
    ".webm",
    ".mov",
];

const fileFilter = (req, file, cb) => {
    const extension =
        path.extname(file.originalname)
            .toLowerCase();

    if (file.fieldname === "thumbnail") {

        if (
            file.mimetype.startsWith("image/") &&
            allowedImages.includes(extension)
        ) {
            return cb(null, true);
        }

        return cb(
            new AppError(
                "Only JPG, JPEG, PNG or WEBP thumbnails are allowed",
                400
            )
        );
    }

    if (file.fieldname === "video") {

        if (
            file.mimetype.startsWith("video/") &&
            allowedVideos.includes(extension)
        ) {
            return cb(null, true);
        }

        return cb(
            new AppError(
                "Only MP4, WEBM or MOV videos are allowed",
                400
            )
        );
    }

    return cb(
        new AppError(
            "Unexpected file field",
            400
        )
    );
};

const movieUpload = multer({
    storage,

    limits: {
        fileSize: 500 * 1024 * 1024,
        files: 2,
    },

    fileFilter,
}).fields([
    {
        name: "thumbnail",
        maxCount: 1,
    },
    {
        name: "video",
        maxCount: 1,
    },
]);

module.exports = movieUpload;