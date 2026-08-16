const express = require("express");

const protect = require("../middlewares/authMiddleware");

const {
    getSubscription,
    createSubscriptionOrder,
    verifySubscriptionPayment,
} = require("../controllers/subscriptionController");

const router = express.Router();

router.get(
    "/",
    protect,
    getSubscription
);

router.post(
    "/create-order",
    protect,
    createSubscriptionOrder
);

router.post(
    "/verify",
    protect,
    verifySubscriptionPayment
);

module.exports = router;