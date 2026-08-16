const asyncHandler = require("../middlewares/asyncHandler");
const AppError = require("../utils/AppError");
const {
    uploadToCloudinary,
} = require("../services/cloudinaryService");

const uploadMovieMedia = asyncHandler(async (req, res) => {
    const thumbnailFile = req.files?.thumbnail?.[0];
    const videoFile = req.files?.video?.[0];

    if (!thumbnailFile) {
        throw new AppError("Thumbnail is required", 400);
    }

    if (!videoFile) {
        throw new AppError("Video is required", 400);
    }

    const thumbnailResult = await uploadToCloudinary(
        thumbnailFile.buffer,
        "image",
        "streamsphere/thumbnails"
    );

    const videoResult = await uploadToCloudinary(
        videoFile.buffer,
        "video",
        "streamsphere/videos"
    );

    res.status(201).json({
        success: true,
        message: "Movie media uploaded successfully",

        thumbnailUrl: thumbnailResult.secure_url,
        thumbnailPublicId: thumbnailResult.public_id,

        videoUrl: videoResult.secure_url,
        videoPublicId: videoResult.public_id,
    });
});

module.exports = {
    uploadMovieMedia,
};