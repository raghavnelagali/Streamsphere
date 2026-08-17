import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./AdminDashboard.css";

function AdminDashboard() {
    const navigate = useNavigate();

    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token =
                    localStorage.getItem("accessToken");

                const response = await api.get(
                    "/admin/dashboard",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

                setStats(response.data.stats);

            } catch (error) {
                console.error(error);

                setError(
                    error.response?.data?.message ||
                    "Failed to load dashboard"
                );

            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <main className="admin-page">

                <div className="admin-loading">
                    Loading dashboard...
                </div>

            </main>
        );
    }

    if (error) {
        return (
            <main className="admin-page">

                <div className="admin-error">
                    {error}
                </div>

            </main>
        );
    }

    return (
        <main className="admin-page">

            <div className="admin-header">

                <div>

                    <span className="admin-label">
                        STREAMSPHERE ADMIN
                    </span>

                    <h1>
                        Dashboard
                    </h1>

                    <p>
                        Manage your streaming platform
                        from one place.
                    </p>

                </div>

            </div>


            <div className="admin-stats-grid">

                <div
                    className="admin-stat-card admin-stat-card-clickable"
                    onClick={() =>
                        navigate("/admin/movies")
                    }
                >

                    <div className="admin-stat-icon">
                        🎬
                    </div>

                    <div>

                        <p>
                            Total Movies
                        </p>

                        <h2>
                            {stats.totalMovies}
                        </h2>

                        <span className="admin-card-action">
                            View all movies →
                        </span>

                    </div>

                </div>


                <div
                    className="admin-stat-card admin-stat-card-clickable"
                    onClick={() =>
                        navigate("/admin/users")
                    }
                >

                    <div className="admin-stat-icon">
                        👥
                    </div>

                    <div>

                        <p>
                            Total Users
                        </p>

                        <h2>
                            {stats.totalUsers}
                        </h2>

                        <span className="admin-card-action">
                            View all users →
                        </span>

                    </div>

                </div>


                <div
                    className="admin-stat-card admin-clickable-card"
                    onClick={() =>
                        navigate("/admin/subscribers")
                    }
                >

                    <div className="admin-stat-icon">
                        ⭐
                    </div>

                    <div>

                        <p>
                            Active Subscribers
                        </p>

                        <h2>
                            {stats.activeSubscribers}
                        </h2>

                        <span className="admin-card-action">
                            View all subscribers →
                        </span>

                    </div>

                </div>


                <div
                    className="admin-stat-card admin-clickable-card"
                    onClick={() =>
                        navigate("/admin/payments")
                    }
                >

                    <div className="admin-stat-icon">
                        ₹
                    </div>

                    <div>

                        <p>
                            Successful Payments
                        </p>

                        <h2>
                            {stats.successfulPayments}
                        </h2>

                        <span className="admin-card-action">
                            View all payments →
                        </span>

                    </div>

                </div>

            </div>


            <div className="admin-welcome-card">

                <div>

                    <span>
                        ADMIN PANEL
                    </span>

                    <h2>
                        Welcome to StreamSphere
                    </h2>

                    <p>
                        From here you can manage
                        movies, users, subscriptions
                        and premium content.
                    </p>

                </div>

            </div>

        </main>
    );
}

export default AdminDashboard;