import { Link } from "react-router-dom";
import "./MovieCard.css";

function MovieCard({ movie }) {
    return (
        <Link
            to={`/movies/${movie._id}`}
            className="movie-card"
        >
            <div className="movie-card-image">
                <img
                    src={movie.thumbnail}
                    alt={movie.title}
                />

                <div className="movie-card-overlay">
                    <span>▶</span>
                </div>

                {movie.premium && (
                    <span className="premium-badge">
                        PREMIUM
                    </span>
                )}
            </div>

            <div className="movie-card-info">

                <h3>{movie.title}</h3>

                <p>
                    {movie.year}
                    <span> • </span>
                    ⭐ {movie.rating}
                </p>

            </div>
        </Link>
    );
}

export default MovieCard;