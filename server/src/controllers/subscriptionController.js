const crypto = require("crypto");

const asyncHandler = require("../middlewares/asyncHandler");
const AppError = require("../utils/AppError");

const razorpay = require("../config/razorpay");
const Payment = require("../models/Payment");

const getSubscription = asyncHandler(async (req, res) => {
    const subscription = req.user.subscription;

    if (!subscription) {
        throw new AppError(
            "Subscription information not found",
            404
        );
    }

    let status = subscription.status;

    if (
        status === "active" &&
        subscription.endDate &&
        new Date() > new Date(subscription.endDate)
    ) {
        status = "expired";
    }

    res.json({
        success: true,
        subscription: {
            status,
            startDate: subscription.startDate,
            endDate: subscription.endDate,
        },
    });
});

const createSubscriptionOrder = asyncHandler(
    async (req, res) => {

        const subscription = req.user.subscription;

        // Check if user already has an active subscription
        if (
            subscription &&
            subscription.status === "active" &&
            subscription.endDate &&
            new Date(subscription.endDate) > new Date()
        ) {
            throw new AppError(
                "You already have an active subscription",
                400
            );
        }

        const amount = 19900;

        const options = {
            amount,
            currency: "INR",
            receipt:
                `subscription_${req.user._id}_${Date.now()}`,
        };

        const order =
            await razorpay.orders.create(options);

        res.status(201).json({
            success: true,
            message: "Subscription order created",

            order: {
                id: order.id,
                amount: order.amount,
                currency: order.currency,
            },
        });
    }
);

const verifySubscriptionPayment = asyncHandler(
    async (req, res) => {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = req.body;

        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {
            throw new AppError(
                "Payment details are required",
                400
            );
        }

        const generatedSignature =
            crypto
                .createHmac(
                    "sha256",
                    process.env.RAZORPAY_KEY_SECRET
                )
                .update(
                    `${razorpay_order_id}|${razorpay_payment_id}`
                )
                .digest("hex");

        if (
            generatedSignature !==
            razorpay_signature
        ) {
            throw new AppError(
                "Payment verification failed",
                400
            );
        }

        const existingPayment =
            await Payment.findOne({
                razorpayPaymentId:
                    razorpay_payment_id,
            });

        if (existingPayment) {
            return res.json({
                success: true,
                message: "Payment already verified",
                payment: existingPayment,
            });
        }

        const payment = await Payment.create({
            user: req.user._id,

            amount: 19900,

            razorpayOrderId:
                razorpay_order_id,

            razorpayPaymentId:
                razorpay_payment_id,

            razorpaySignature:
                razorpay_signature,

            status: "success",
        });

        const startDate = new Date();

        const endDate = new Date(startDate);

        endDate.setMonth(
            endDate.getMonth() + 1
        );

        req.user.subscription = {
            status: "active",
            startDate,
            endDate,
        };

        await req.user.save();

        res.json({
            success: true,
            message:
                "Payment verified and subscription activated",

            subscription:
                req.user.subscription,

            payment,
        });
    }
);

module.exports = {
    getSubscription,
    createSubscriptionOrder,
    verifySubscriptionPayment,
};