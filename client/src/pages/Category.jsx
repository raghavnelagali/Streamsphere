import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMovies } from "../services/movieService";
import MovieCard from "../components/MovieCard";
import "./Category.css";

function Category() {
    const { category } = useParams();

    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                setLoading(true);

                const data = await getMovies({
                    category,
                });

                setMovies(data.movies);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, [category]);

    if (loading) {
        return (
            <main className="category-page">

                <div className="category-loading">

                    <div className="loading-spinner"></div>

                    <p>
                        Loading {category} movies...
                    </p>

                </div>

            </main>
        );
    }

    return (
        <main className="category-page">

            <div className="category-header">

                <div>

                    <span className="category-label">
                        EXPLORE
                    </span>

                    <h1>
                        {category}
                    </h1>

                    <p>
                        {movies.length === 0
                            ? `No ${category} movies available`
                            : `${movies.length} movie${
                                movies.length > 1
                                    ? "s"
                                    : ""
                            } available`}
                    </p>

                </div>

            </div>

            {movies.length === 0 ? (

                <div className="category-empty">

                    <div className="category-empty-icon">
                        🎬
                    </div>

                    <h2>
                        No movies available
                    </h2>

                    <p>
                        There are currently no movies
                        in the {category} category.
                    </p>

                </div>

            ) : (

                <div className="category-movie-grid">

                    {movies.map((movie) => (
                        <MovieCard
                            key={movie._id}
                            movie={movie}
                        />
                    ))}

                </div>

            )}

        </main>
    );
}

export default Category;