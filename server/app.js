const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const healthRoutes = require("./src/routes/healthRoutes");
const authRoutes = require("./src/routes/authRoutes");
const movieRoutes = require("./src/routes/movieRoutes");
const uploadRoutes = require("./src/routes/uploadRoutes");
const subscriptionRoutes = require("./src/routes/subscriptionRoutes");
const adminRoutes = require("./src/routes/adminRoutes");

const notFound = require("./src/middlewares/notFound");
const errorMiddleware = require("./src/middlewares/errorMiddleware");

const app = express();

app.use(helmet());


app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "https://streamsphere-d48u.onrender.com",
        ],
        credentials: true,
    })
);


app.use(
    express.json({
        limit: "1mb",
    })
);


const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,

    max: 20,

    message: {
        success: false,
        message:
            "Too many authentication attempts. Please try again later.",
    },

    standardHeaders: true,

    legacyHeaders: false,
});


app.use(
    "/api/v1/health",
    healthRoutes
);

app.use(
    "/api/v1/auth/login",
    authLimiter
);

app.use(
    "/api/v1/auth/register",
    authLimiter
);

app.use(
    "/api/v1/auth",
    authRoutes
);

app.use(
    "/api/v1/movies",
    movieRoutes
);

app.use(
    "/api/v1/upload",
    uploadRoutes
);

app.use(
    "/api/v1/subscription",
    subscriptionRoutes
);

app.use(
    "/api/v1/admin",
    adminRoutes
);


app.use(notFound);

app.use(errorMiddleware);


module.exports = app;