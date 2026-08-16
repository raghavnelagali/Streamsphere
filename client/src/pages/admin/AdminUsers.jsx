import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminUsers.css";

function AdminUsers() {
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError("");

            const token =
                localStorage.getItem("accessToken");

            const response = await axios.get(
                "http://localhost:5000/api/v1/admin/users",
                {
                    params: {
                        search,
                    },
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            setUsers(response.data.users);

        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Unable to load users"
            );

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [search]);

    const getSubscriptionStatus = (user) => {
        if (
            user.subscription?.status === "active" &&
            user.subscription?.endDate &&
            new Date() >
                new Date(user.subscription.endDate)
        ) {
            return "expired";
        }

        return (
            user.subscription?.status ||
            "inactive"
        );
    };

    return (
        <main className="admin-users-page">

            <div className="admin-users-header">

                <div>

                    <span className="admin-label">
                        STREAMSPHERE ADMIN
                    </span>

                    <h1>
                        User Management
                    </h1>

                    <p>
                        Manage registered users and
                        subscription status.
                    </p>

                </div>

                <button
                    className="admin-back-button"
                    onClick={() => navigate("/admin")}
                >
                    ← Back to Dashboard
                </button>

            </div>


            <div className="admin-users-toolbar">

                <input
                    type="text"
                    placeholder="Search users by name or email..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />

            </div>


            {error && (
                <div className="admin-users-error">
                    {error}
                </div>
            )}


            {loading ? (
                <p className="admin-users-loading">
                    Loading users...
                </p>
            ) : users.length === 0 ? (
                <div className="admin-users-empty">
                    No users found.
                </div>
            ) : (
                <div className="admin-users-table-wrapper">

                    <table className="admin-users-table">

                        <thead>

                            <tr>

                                <th>
                                    Name
                                </th>

                                <th>
                                    Email
                                </th>

                                <th>
                                    Role
                                </th>

                                <th>
                                    Subscription
                                </th>

                                <th>
                                    Start Date
                                </th>

                                <th>
                                    End Date
                                </th>

                                <th>
                                    Joined
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {users.map((user) => {

                                const status =
                                    getSubscriptionStatus(
                                        user
                                    );

                                return (
                                    <tr
                                        key={user._id}
                                    >

                                        <td className="user-name">
                                            {user.name}
                                        </td>

                                        <td className="user-email">
                                            {user.email}
                                        </td>

                                        <td>
                                            <span
                                                className={`role-badge ${
                                                    user.role
                                                }`}
                                            >
                                                {user.role}
                                            </span>
                                        </td>

                                        <td>
                                            <span
                                                className={`subscription-badge ${status}`}
                                            >
                                                {status}
                                            </span>
                                        </td>

                                        <td>
                                            {user.subscription?.startDate
                                                ? new Date(
                                                    user.subscription.startDate
                                                ).toLocaleDateString()
                                                : "-"}
                                        </td>

                                        <td>
                                            {user.subscription?.endDate
                                                ? new Date(
                                                    user.subscription.endDate
                                                ).toLocaleDateString()
                                                : "-"}
                                        </td>

                                        <td>
                                            {new Date(
                                                user.createdAt
                                            ).toLocaleDateString()}
                                        </td>

                                    </tr>
                                );
                            })}

                        </tbody>

                    </table>

                </div>
            )}

        </main>
    );
}

export default AdminUsers;