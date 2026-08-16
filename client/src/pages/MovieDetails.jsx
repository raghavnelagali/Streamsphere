import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMovieById } from "../services/movieService";
import { useAuth } from "../context/AuthContext";
import "./MovieDetails.css";

function MovieDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { isAuthenticated, user } = useAuth();

    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const data = await getMovieById(id);

                setMovie(data.movie);
            } catch (error) {
                console.error(error);

                setError(
                    error.response?.data?.message ||
                    "Movie not found"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchMovie();
    }, [id]);

    const handleWatch = () => {
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }

        if (user?.subscription?.status !== "active") {
            navigate("/subscription");
            return;
        }

        navigate(`/watch/${movie._id}`);
    };

    if (loading) {
        return (
            <div className="details-loading">
                Loading movie...
            </div>
        );
    }

    if (error || !movie) {
        return (
            <div className="details-error">
                <h2>{error || "Movie not found"}</h2>

                <button
                    onClick={() => navigate("/")}
                >
                    Back to Home
                </button>
            </div>
        );
    }

    return (
        <main className="movie-details">

            <section
                className="movie-details-hero"
                style={{
                    backgroundImage: `
                        linear-gradient(
                            to right,
                            rgba(8, 8, 12, 0.98),
                            rgba(8, 8, 12, 0.75),
                            rgba(8, 8, 12, 0.25)
                        ),
                        linear-gradient(
                            to top,
                            #0b0b0f,
                            transparent
                        ),
                        url(${movie.thumbnail})
                    `,
                }}
            >

                <div className="movie-details-content">

                    <div className="movie-details-poster">
                        <img
                            src={movie.thumbnail}
                            alt={movie.title}
                        />
                    </div>

                    <div className="movie-details-info">

                        <span className="details-premium">
                            PREMIUM
                        </span>

                        <h1>{movie.title}</h1>

                        <div className="details-meta">

                            <span>{movie.year}</span>

                            <span>•</span>

                            <span>{movie.duration}</span>

                            <span>•</span>

                            <span>
                                ⭐ {movie.rating}
                            </span>

                            <span>•</span>

                            <span>{movie.language}</span>

                        </div>

                        <p className="details-description">
                            {movie.description}
                        </p>

                        <div className="details-tags">

                            <span>
                                {movie.category}
                            </span>

                            <span>
                                {movie.genre}
                            </span>

                        </div>

                        <div className="details-actions">

                            <button
                                className="details-watch-button"
                                onClick={handleWatch}
                            >
                                ▶ Watch Now
                            </button>

                            <button
                                className="details-back-button"
                                onClick={() =>
                                    navigate(-1)
                                }
                            >
                                Go Back
                            </button>

                        </div>

                    </div>

                </div>

            </section>

        </main>
    );
}

export default MovieDetails;