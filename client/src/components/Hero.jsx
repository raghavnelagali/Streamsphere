import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Hero.css";

function Hero({ movie }) {
    const navigate = useNavigate();

    const { isAuthenticated, user } = useAuth();

    if (!movie) {
        return null;
    }

    const handleWatch = () => {
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }

        if (
    user?.subscription?.status !== "active" ||
    !user?.subscription?.endDate ||
    new Date(user.subscription.endDate) <= new Date()
) {
    navigate("/subscription");
    return;
}

        navigate(`/watch/${movie._id}`);
    };

    const handleMoreInfo = () => {
        navigate(`/movies/${movie._id}`);
    };

    return (
        <section
            className="hero"
            style={{
                backgroundImage: `
                    linear-gradient(
                        to right,
                        rgba(10, 10, 15, 0.98) 0%,
                        rgba(10, 10, 15, 0.75) 45%,
                        rgba(10, 10, 15, 0.2) 100%
                    ),
                    linear-gradient(
                        to top,
                        #0b0b0f 0%,
                        transparent 40%
                    ),
                    url(${movie.thumbnail})
                `,
            }}
        >
            <div className="hero-content">

                <span className="hero-label">
                    STREAMSPHERE ORIGINAL
                </span>

                <h1>{movie.title}</h1>

                <div className="hero-meta">
                    <span>{movie.year}</span>

                    <span>•</span>

                    <span>{movie.duration}</span>

                    <span>•</span>

                    <span>⭐ {movie.rating}</span>

                    <span>•</span>

                    <span>{movie.language}</span>
                </div>

                <p className="hero-description">
                    {movie.description}
                </p>

                <div className="hero-buttons">

                    <button
                        className="hero-watch-button"
                        onClick={handleWatch}
                    >
                        ▶ Watch Now
                    </button>

                    <button
                        className="hero-info-button"
                        onClick={handleMoreInfo}
                    >
                        More Info
                    </button>

                </div>

            </div>
        </section>
    );
}

export default Hero;