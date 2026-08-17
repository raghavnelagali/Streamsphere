import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./AdminPayments.css";

function AdminPayments() {
    const navigate = useNavigate();

    const [payments, setPayments] = useState([]);
    const [totalRevenue, setTotalRevenue] = useState(0);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const token =
                    localStorage.getItem("accessToken");

                const response = await api.get(
                    "/admin/payments",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

                setPayments(
                    response.data.payments
                );

                setTotalRevenue(
                    response.data.totalRevenue
                );

            } catch (error) {
                console.error(error);

                setError(
                    error.response?.data?.message ||
                    "Failed to load payments"
                );

            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, []);

    const formatDate = (date) => {
        if (!date) {
            return "-";
        }

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };

    const formatTime = (date) => {
        if (!date) {
            return "";
        }

        return new Date(date).toLocaleTimeString(
            "en-IN",
            {
                hour: "2-digit",
                minute: "2-digit",
            }
        );
    };

    const formatAmount = (amount) => {
        return `₹${(amount / 100).toLocaleString(
            "en-IN"
        )}`;
    };

    if (loading) {
        return (
            <main className="admin-payments-page">
                <div className="admin-loading">
                    Loading payments...
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="admin-payments-page">
                <div className="admin-error">
                    {error}
                </div>
            </main>
        );
    }

    return (
        <main className="admin-payments-page">

            <div className="admin-payments-header">

                <div>

                    <span className="admin-label">
                        STREAMSPHERE ADMIN
                    </span>

                    <h1>
                        Successful Payments
                    </h1>

                    <p>
                        View successful Premium
                        subscription payments.
                    </p>

                </div>

                <button
                    className="admin-back-button"
                    onClick={() =>
                        navigate("/admin")
                    }
                >
                    ← Back to Dashboard
                </button>

            </div>


            <div className="payment-summary">

                <div className="payment-summary-card">

                    <span>
                        TOTAL PAYMENTS
                    </span>

                    <strong>
                        {payments.length}
                    </strong>

                </div>


                <div className="payment-summary-card">

                    <span>
                        TOTAL REVENUE
                    </span>

                    <strong>
                        {formatAmount(
                            totalRevenue
                        )}
                    </strong>

                </div>

            </div>


            {payments.length === 0 ? (

                <div className="admin-empty">

                    <h2>
                        No successful payments
                    </h2>

                    <p>
                        Successful Premium payments
                        will appear here.
                    </p>

                </div>

            ) : (

                <div className="payments-table">

                    <div className="payments-table-header">

                        <span>
                            User
                        </span>

                        <span>
                            Amount
                        </span>

                        <span>
                            Order ID
                        </span>

                        <span>
                            Payment ID
                        </span>

                        <span>
                            Date
                        </span>

                        <span>
                            Status
                        </span>

                    </div>


                    {payments.map((payment) => (

                        <div
                            className="payment-row"
                            key={payment._id}
                        >

                            <div className="payment-user">

                                <div className="payment-avatar">
                                    {payment.user?.name
                                        ?.charAt(0)
                                        .toUpperCase()}
                                </div>

                                <div>

                                    <h3>
                                        {payment.user?.name ||
                                            "Unknown User"}
                                    </h3>

                                    <p>
                                        {payment.user?.email ||
                                            "-"}
                                    </p>

                                </div>

                            </div>


                            <span className="payment-amount">
                                {formatAmount(
                                    payment.amount
                                )}
                            </span>


                            <span
                                className="payment-id"
                                title={
                                    payment.razorpayOrderId
                                }
                            >
                                {
                                    payment.razorpayOrderId
                                }
                            </span>


                            <span
                                className="payment-id"
                                title={
                                    payment.razorpayPaymentId
                                }
                            >
                                {
                                    payment.razorpayPaymentId
                                }
                            </span>


                            <span>
                                {formatDate(
                                    payment.createdAt
                                )}

                                <small>
                                    {formatTime(
                                        payment.createdAt
                                    )}
                                </small>
                            </span>


                            <span>
                                <span className="success-status">
                                    SUCCESS
                                </span>
                            </span>

                        </div>

                    ))}

                </div>

            )}

        </main>
    );
}

export default AdminPayments;