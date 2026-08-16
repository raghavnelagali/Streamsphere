const express = require("express");

const {
    getDashboardStats,
    getAdminMovies,
    getUsers,
    getActiveSubscribers,
    getSuccessfulPayments,
} = require("../controllers/adminController");

const protect = require("../middlewares/authMiddleware");
const admin = require("../middlewares/adminMiddleware");

const router = express.Router();

router.get(
    "/dashboard",
    protect,
    admin,
    getDashboardStats
);

router.get(
    "/movies",
    protect,
    admin,
    getAdminMovies
);

router.get(
    "/users",
    protect,
    admin,
    getUsers
);

router.get(
    "/subscribers",
    protect,
    admin,
    getActiveSubscribers
);

router.get(
    "/payments",
    protect,
    admin,
    getSuccessfulPayments
);

module.exports = router;