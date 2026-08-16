import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import "./Subscription.css";

function Subscription() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const {
        user,
        isAuthenticated,
        refreshUser,
    } = useAuth();

    const isActive =
        user?.subscription?.status === "active";

    const handleSubscribe = async () => {
        try {
            setLoading(true);
            setError("");
            setSuccess("");

            const token =
                localStorage.getItem("accessToken");

            if (!token) {
                setError("Please login first");
                return;
            }

            const response = await axios.post(
                "http://localhost:5000/api/v1/subscription/create-order",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const order = response.data.order;

            const options = {
                key: import.meta.env
                    .VITE_RAZORPAY_KEY_ID,

                amount: order.amount,

                currency: order.currency,

                name: "StreamSphere",

                description:
                    "StreamSphere Premium - 1 Month",

                order_id: order.id,

                handler: async function (
                    paymentResponse
                ) {
                    try {
                        const verifyResponse =
                            await axios.post(
                                "http://localhost:5000/api/v1/subscription/verify",
                                {
                                    razorpay_order_id:
                                        paymentResponse.razorpay_order_id,

                                    razorpay_payment_id:
                                        paymentResponse.razorpay_payment_id,

                                    razorpay_signature:
                                        paymentResponse.razorpay_signature,
                                },
                                {
                                    headers: {
                                        Authorization: `Bearer ${token}`,
                                    },
                                }
                            );

                        console.log(
                            verifyResponse.data
                        );

                        await refreshUser();

                        setSuccess(
                            "Payment successful! Your subscription is now active."
                        );

                        navigate("/");

                    } catch (error) {
                        console.error(error);

                        setError(
                            error.response?.data
                                ?.message ||
                            "Payment verification failed"
                        );
                    }
                },

                prefill: {
                    name:
                        user?.name ||
                        "StreamSphere User",
                },

                theme: {
                    color: "#7c3aed",
                },
            };

            const razorpay =
                new window.Razorpay(options);

            razorpay.open();

        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Unable to create subscription order"
            );
        } finally {
            setLoading(false);
        }
    };

    /*
     * If user is not logged in
     */
    if (!isAuthenticated) {
        return (
            <main className="subscription-page">
                <div className="subscription-card">

                    <div className="subscription-card-header">
                        <h2>
                            Login Required
                        </h2>
                    </div>

                    <p className="subscription-description">
                        Please login to manage your
                        StreamSphere Premium
                        subscription.
                    </p>

                    <button
                        className="subscribe-button"
                        onClick={() =>
                            navigate("/login")
                        }
                    >
                        Login
                    </button>

                </div>
            </main>
        );
    }

    return (
        <main className="subscription-page">

            <div className="subscription-container">

                <div className="subscription-header">

                    <span className="subscription-label">
                        STREAMSPHERE PREMIUM
                    </span>

                    <h1>
                        Unlimited entertainment.
                    </h1>

                    <p>
                        Watch your favorite movies
                        anytime, anywhere with
                        StreamSphere Premium.
                    </p>

                </div>

                <div className="subscription-card">

                    <div className="subscription-card-header">

                        <h2>
                            StreamSphere Premium
                        </h2>

                        <span className="premium-badge-large">
                            PREMIUM
                        </span>

                    </div>

                    {isActive ? (
                        <>
                            <div className="subscription-active">

                                <div className="active-icon">
                                    ✓
                                </div>

                                <h2>
                                    Premium Active
                                </h2>

                                <p>
                                    Your StreamSphere
                                    Premium subscription
                                    is active.
                                </p>

                                {user?.subscription
                                    ?.endDate && (
                                    <p className="subscription-expiry">
                                        Valid until:{" "}
                                        {new Date(
                                            user.subscription.endDate
                                        ).toLocaleDateString()}
                                    </p>
                                )}

                            </div>

                            <button
                                className="subscribe-button"
                                onClick={() =>
                                    navigate("/")
                                }
                            >
                                Start Watching
                            </button>

                        </>
                    ) : (
                        <>
                            <div className="subscription-price">

                                <span className="price">
                                    ₹199
                                </span>

                                <span className="price-period">
                                    / month
                                </span>

                            </div>

                            <p className="subscription-description">
                                Get unlimited access
                                to all premium movies
                                and enjoy high-quality
                                streaming.
                            </p>

                            <div className="subscription-features">

                                <div>
                                    ✓ Unlimited premium movies
                                </div>

                                <div>
                                    ✓ Watch anytime
                                </div>

                                <div>
                                    ✓ High-quality video streaming
                                </div>

                                <div>
                                    ✓ Full-screen playback
                                </div>

                                <div>
                                    ✓ Cancel anytime
                                </div>

                            </div>

                            {error && (
                                <div className="subscription-error">
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="subscription-success">
                                    {success}
                                </div>
                            )}

                            <button
                                className="subscribe-button"
                                onClick={handleSubscribe}
                                disabled={loading}
                            >
                                {loading
                                    ? "Creating Order..."
                                    : "Subscribe Now"}
                            </button>

                            <p className="payment-note">
                                Secure payment powered
                                by Razorpay
                            </p>

                        </>
                    )}

                </div>

            </div>

        </main>
    );
}

export default Subscription;