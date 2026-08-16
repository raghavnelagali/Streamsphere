const asyncHandler = require("../middlewares/asyncHandler");
const User = require("../models/User");
const Movie = require("../models/Movie");
const Payment = require("../models/Payment");

const getDashboardStats = asyncHandler(
    async (req, res) => {

        const totalUsers =
            await User.countDocuments({
                role: "user",
            });

        const totalMovies =
            await Movie.countDocuments();

        const activeSubscribers =
            await User.countDocuments({
                "subscription.status": "active",
            });

        const successfulPayments =
            await Payment.countDocuments({
                status: "success",
            });

        res.json({
            success: true,

            stats: {
                totalUsers,
                totalMovies,
                activeSubscribers,
                successfulPayments,
            },
        });
    }
);

const getAdminMovies = asyncHandler(
    async (req, res) => {

        const movies = await Movie.find()
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: movies.length,
            movies,
        });
    }
);

const getUsers = asyncHandler(async (req, res) => {
    const {
        search = "",
        page = 1,
        limit = 10,
    } = req.query;

    const query = {};

    if (search.trim()) {
        query.$or = [
            {
                name: {
                    $regex: search,
                    $options: "i",
                },
            },
            {
                email: {
                    $regex: search,
                    $options: "i",
                },
            },
        ];
    }

    const pageNumber = Math.max(
        Number(page),
        1
    );

    const limitNumber = Math.min(
        Math.max(Number(limit), 1),
        50
    );

    const skip =
        (pageNumber - 1) * limitNumber;

    const totalUsers =
        await User.countDocuments(query);

    const users = await User.find(query)
        .select("-password")
        .sort({
            createdAt: -1,
        })
        .skip(skip)
        .limit(limitNumber);

    const totalPages =
        Math.ceil(
            totalUsers / limitNumber
        );

    res.json({
        success: true,

        count: users.length,

        totalUsers,

        page: pageNumber,

        limit: limitNumber,

        totalPages,

        users,
    });
});

const getActiveSubscribers = asyncHandler(
    async (req, res) => {
        const users = await User.find({
            role: "user",
            "subscription.status": "active",
        })
            .select(
                "name email subscription"
            )
            .sort({
                "subscription.endDate": 1,
            });

        const now = new Date();

        const subscribers = users
            .map((user) => {
                const subscription =
                    user.subscription;

                // Check whether subscription has expired
                if (
                    subscription.endDate &&
                    now > new Date(
                        subscription.endDate
                    )
                ) {
                    return null;
                }

                let daysRemaining = 0;

                if (subscription.endDate) {
                    const difference =
                        new Date(
                            subscription.endDate
                        ).getTime() -
                        now.getTime();

                    daysRemaining = Math.max(
                        Math.ceil(
                            difference /
                                (1000 *
                                    60 *
                                    60 *
                                    24)
                        ),
                        0
                    );
                }

                return {
                    _id: user._id,

                    name: user.name,

                    email: user.email,

                    subscription: {
                        status:
                            subscription.status,

                        startDate:
                            subscription.startDate,

                        endDate:
                            subscription.endDate,
                    },

                    daysRemaining,
                };
            })
            .filter(Boolean);

        res.json({
            success: true,

            count: subscribers.length,

            subscribers,
        });
    }
);

const getSuccessfulPayments = asyncHandler(
    async (req, res) => {
        const payments = await Payment.find({
            status: "success",
        })
            .populate(
                "user",
                "name email"
            )
            .sort({
                createdAt: -1,
            });

        const totalRevenue = payments.reduce(
            (total, payment) =>
                total + payment.amount,
            0
        );

        res.json({
            success: true,

            count: payments.length,

            totalRevenue,

            payments,
        });
    }
);

module.exports = {
    getDashboardStats,
    getAdminMovies,
    getUsers,
    getActiveSubscribers,
    getSuccessfulPayments,
};