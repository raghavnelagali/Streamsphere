import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./AdminMovies.css";

function AdminMovies() {
    const navigate = useNavigate();

    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchMovies = async () => {
        try {
            const token =
                localStorage.getItem("accessToken");

            const response = await api.get(
                "/admin/movies",
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            setMovies(response.data.movies);

        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to load movies"
            );

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMovies();
    }, []);

    const handleDelete = async (id) => {
        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this movie?"
            );

        if (!confirmDelete) {
            return;
        }

        try {
            const token =
                localStorage.getItem("accessToken");

            await api.delete(
                `/movies/${id}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            setMovies((previousMovies) =>
                previousMovies.filter(
                    (movie) =>
                        movie._id !== id
                )
            );

        } catch (error) {
            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to delete movie"
            );
        }
    };

    if (loading) {
        return (
            <main className="admin-page">
                <div className="admin-loading">
                    Loading movies...
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

            {/* HEADER */}

            <div className="admin-movies-header">

                <div className="admin-movies-heading">

                    <span className="admin-label">
                        STREAMSPHERE ADMIN
                    </span>

                    <h1>
                        Movie Management
                    </h1>

                    <p>
                        Add, edit and manage
                        your premium movies.
                    </p>

                </div>


                {/* HEADER ACTIONS */}

                <div className="admin-movies-actions">

                    <button
                        className="admin-back-button"
                        onClick={() =>
                            navigate("/admin")
                        }
                    >
                        ← Back to Dashboard
                    </button>

                    <button
                        className="admin-add-button"
                        onClick={() =>
                            navigate(
                                "/admin/movies/add"
                            )
                        }
                    >
                        + Add Movie
                    </button>

                </div>

            </div>


            {/* MOVIES */}

            {movies.length === 0 ? (

                <div className="admin-empty">
                    No movies found.
                </div>

            ) : (

                <div className="admin-movies-table">

                    <div className="admin-table-header">

                        <span>
                            Movie
                        </span>

                        <span>
                            Category
                        </span>

                        <span>
                            Year
                        </span>

                        <span>
                            Rating
                        </span>

                        <span>
                            Status
                        </span>

                        <span>
                            Actions
                        </span>

                    </div>


                    {movies.map((movie) => (

                        <div
                            className="admin-movie-row"
                            key={movie._id}
                        >

                            <div className="admin-movie-title">

                                <img
                                    src={movie.thumbnail}
                                    alt={movie.title}
                                />

                                <div>

                                    <h3>
                                        {movie.title}
                                    </h3>

                                    <p>
                                        {movie.language}
                                        {" • "}
                                        {movie.duration}
                                    </p>

                                </div>

                            </div>


                            <span>
                                {movie.category}
                            </span>


                            <span>
                                {movie.year}
                            </span>


                            <span>
                                ⭐ {movie.rating}
                            </span>


                            <span>
                                <span className="premium-status">
                                    PREMIUM
                                </span>
                            </span>


                            <div className="admin-actions">

                                <button
                                    className="edit-button"
                                    onClick={() =>
                                        navigate(
                                            `/admin/movies/edit/${movie._id}`
                                        )
                                    }
                                >
                                    Edit
                                </button>


                                <button
                                    className="delete-button"
                                    onClick={() =>
                                        handleDelete(
                                            movie._id
                                        )
                                    }
                                >
                                    Delete
                                </button>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </main>
    );
}

export default AdminMovies;