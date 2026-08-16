import MovieCard from "./MovieCard";
import "./MovieRow.css";

function MovieRow({ title, movies }) {
    if (!movies || movies.length === 0) {
        return null;
    }

    return (
        <section className="movie-section">

            <div className="movie-section-header">

                <h2>
                    {title}
                </h2>

                <span className="movie-section-line"></span>

            </div>

            <div
                className="movie-row"
                aria-label={`${title} movies`}
            >

                {movies.map((movie) => (
                    <MovieCard
                        key={movie._id}
                        movie={movie}
                    />
                ))}

            </div>

        </section>
    );
}

export default MovieRow;