const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
        },

        thumbnail: {
            type: String,
            required: true,
        },

        videoUrl: {
            type: String,
            default: null,
        },

        category: {
            type: String,
            required: true,
            trim: true,
        },

        genre: {
            type: String,
            required: true,
            trim: true,
        },

        year: {
            type: Number,
            required: true,
        },

        duration: {
            type: String,
            required: true,
        },

        rating: {
            type: Number,
            min: 0,
            max: 10,
            default: 0,
        },

        language: {
            type: String,
            required: true,
        },

        featured: {
            type: Boolean,
            default: false,
        },

        trending: {
            type: Boolean,
            default: false,
        },

        premium: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Movie", movieSchema);