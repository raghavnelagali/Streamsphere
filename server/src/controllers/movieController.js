const Movie = require("../models/Movie");
const asyncHandler = require("../middlewares/asyncHandler");
const AppError = require("../utils/AppError");
const {
    uploadToCloudinary,
} = require("../services/cloudinaryService");

const getMovies = asyncHandler(async (req, res) => {
    const {
        search,
        category,
        genre,
        page = 1,
        limit = 10,
    } = req.query;

    const query = {};

    if (search) {
        query.$or = [
            {
                title: {
                    $regex: search,
                    $options: "i",
                },
            },
            {
                genre: {
                    $regex: search,
                    $options: "i",
                },
            },
            {
                description: {
                    $regex: search,
                    $options: "i",
                },
            },
        ];
    }

    if (category) {
        query.category = category;
    }

    if (genre) {
        query.genre = genre;
    }

    const pageNumber = Math.max(Number(page), 1);
    const limitNumber = Math.min(
        Math.max(Number(limit), 1),
        50
    );

    const skip = (pageNumber - 1) * limitNumber;

    const totalMovies = await Movie.countDocuments(query);

    const movies = await Movie.find(query)
    .select("-videoUrl")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNumber);

    const totalPages = Math.ceil(
        totalMovies / limitNumber
    );

    res.json({
        success: true,
        count: movies.length,
        totalMovies,
        page: pageNumber,
        limit: limitNumber,
        totalPages,
        movies,
    });
});

const getMovieById = asyncHandler(async (req, res) => {
    const movie = await Movie.findById(
        req.params.id
    ).select("-videoUrl");

    if (!movie) {
        throw new AppError(
            "Movie not found",
            404
        );
    }

    res.json({
        success: true,
        movie,
    });
});

const watchMovie = asyncHandler(async (req, res) => {
    const movie = await Movie.findById(req.params.id)
        .select(
            "title description thumbnail category genre year duration rating language premium videoUrl"
        );

    if (!movie) {
        throw new AppError("Movie not found", 404);
    }

    const subscription = req.user.subscription;

    if (!subscription) {
        throw new AppError(
            "Premium subscription required",
            403
        );
    }

    if (subscription.status !== "active") {
        throw new AppError(
            "Active subscription required",
            403
        );
    }

    if (
        subscription.endDate &&
        new Date() > new Date(subscription.endDate)
    ) {
        throw new AppError(
            "Your subscription has expired",
            403
        );
    }

    if (!movie.videoUrl) {
        throw new AppError(
            "Video is not available",
            404
        );
    }

    res.json({
        success: true,
        message: "Video access granted",

        movie: {
            title: movie.title,
            description: movie.description,
            thumbnail: movie.thumbnail,
            category: movie.category,
            genre: movie.genre,
            year: movie.year,
            duration: movie.duration,
            rating: movie.rating,
            language: movie.language,
            premium: movie.premium,
        },

        videoUrl: movie.videoUrl,
    });
});

const createMovie = asyncHandler(async (req, res) => {
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

    const movie = await Movie.create({
    ...req.body,

    thumbnail: thumbnailResult.secure_url,

    videoUrl: videoResult.secure_url,

    premium: true,
});

    res.status(201).json({
        success: true,
        message: "Movie created successfully",
        movie,
    });
});

const updateMovie = asyncHandler(async (req, res) => {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
        throw new AppError("Movie not found", 404);
    }

    const thumbnailFile =
        req.files?.thumbnail?.[0];

    const videoFile =
        req.files?.video?.[0];

    // Update normal movie information
    Object.assign(movie, {
        ...req.body,
        premium: true,
    });

    // Upload new thumbnail only if admin selected one
    if (thumbnailFile) {
        const thumbnailResult =
            await uploadToCloudinary(
                thumbnailFile.buffer,
                "image",
                "streamsphere/thumbnails"
            );

        movie.thumbnail =
            thumbnailResult.secure_url;
    }

    // Upload new video only if admin selected one
    if (videoFile) {
        const videoResult =
            await uploadToCloudinary(
                videoFile.buffer,
                "video",
                "streamsphere/videos"
            );

        movie.videoUrl =
            videoResult.secure_url;
    }

    await movie.save();

    res.json({
        success: true,
        message: "Movie updated successfully",
        movie,
    });
});

const deleteMovie = asyncHandler(async (req, res) => {
    const movie = await Movie.findByIdAndDelete(req.params.id);

    if (!movie) {
        throw new AppError("Movie not found", 404);
    }

    res.json({
        success: true,
        message: "Movie deleted successfully",
    });
});

module.exports = {
    getMovies,
    getMovieById,
    watchMovie,
    createMovie,
    updateMovie,
    deleteMovie,
};