import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./AdminSubscribers.css";

function AdminSubscribers() {
    const navigate = useNavigate();

    const [subscribers, setSubscribers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchSubscribers = async () => {
            try {
                const token =
                    localStorage.getItem("accessToken");

                const response = await api.get(
                    "/admin/subscribers",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

                setSubscribers(
                    response.data.subscribers
                );

            } catch (error) {
                console.error(error);

                setError(
                    error.response?.data?.message ||
                    "Failed to load subscribers"
                );

            } finally {
                setLoading(false);
            }
        };

        fetchSubscribers();
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

    if (loading) {
        return (
            <main className="admin-subscribers-page">
                <div className="admin-loading">
                    Loading subscribers...
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="admin-subscribers-page">
                <div className="admin-error">
                    {error}
                </div>
            </main>
        );
    }

    return (
        <main className="admin-subscribers-page">

            <div className="admin-subscribers-header">

                <div>

                    <span className="admin-label">
                        STREAMSPHERE ADMIN
                    </span>

                    <h1>
                        Active Subscribers
                    </h1>

                    <p>
                        View users who currently have
                        an active Premium subscription.
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


            <div className="subscriber-summary">

                <div className="subscriber-summary-icon">
                    ★
                </div>

                <div>

                    <span>
                        ACTIVE SUBSCRIBERS
                    </span>

                    <strong>
                        {subscribers.length}
                    </strong>

                </div>

            </div>


            {subscribers.length === 0 ? (

                <div className="admin-empty">

                    <h2>
                        No active subscribers
                    </h2>

                    <p>
                        There are currently no users
                        with an active Premium subscription.
                    </p>

                </div>

            ) : (

                <div className="subscribers-table">

                    <div className="subscribers-table-header">

                        <span>
                            User
                        </span>

                        <span>
                            Subscription Start
                        </span>

                        <span>
                            Expiry Date
                        </span>

                        <span>
                            Remaining
                        </span>

                        <span>
                            Status
                        </span>

                    </div>


                    {subscribers.map((subscriber) => (

                        <div
                            className="subscriber-row"
                            key={subscriber._id}
                        >

                            <div className="subscriber-user">

                                <div className="subscriber-avatar">
                                    {subscriber.name
                                        ?.charAt(0)
                                        .toUpperCase()}
                                </div>

                                <div>

                                    <h3>
                                        {subscriber.name}
                                    </h3>

                                    <p>
                                        {subscriber.email}
                                    </p>

                                </div>

                            </div>


                            <span>
                                {formatDate(
                                    subscriber.subscription
                                        ?.startDate
                                )}
                            </span>


                            <span>
                                {formatDate(
                                    subscriber.subscription
                                        ?.endDate
                                )}
                            </span>


                            <span className="days-remaining">

                                {subscriber.daysRemaining}{" "}

                                {subscriber.daysRemaining === 1
                                    ? "day"
                                    : "days"}

                            </span>


                            <span>

                                <span className="active-status">
                                    ACTIVE
                                </span>

                            </span>

                        </div>

                    ))}

                </div>

            )}

        </main>
    );
}

export default AdminSubscribers;