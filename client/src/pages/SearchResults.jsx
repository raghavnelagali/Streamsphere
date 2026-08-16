import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getMovies } from "../services/movieService";
import MovieCard from "../components/MovieCard";
import "./SearchResults.css";

function SearchResults() {
    const [searchParams] = useSearchParams();

    const search = searchParams.get("search") || "";

    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                setLoading(true);

                const data = await getMovies({
                    search,
                });

                setMovies(data.movies);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, [search]);

    if (loading) {
        return (
            <main className="search-page">
                <div className="search-loading">
                    <div className="loading-spinner"></div>

                    <p>
                        Searching for "{search}"...
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main className="search-page">

            <div className="search-page-header">

                <div>
                    <span className="search-page-label">
                        SEARCH
                    </span>

                    <h1>
                        Results for{" "}
                        <span>"{search}"</span>
                    </h1>

                    <p>
                        {movies.length === 0
                            ? "No movies found"
                            : `${movies.length} movie${
                                movies.length > 1
                                    ? "s"
                                    : ""
                            } found`}
                    </p>
                </div>

            </div>

            {movies.length === 0 ? (

                <div className="no-results">

                    <div className="no-results-icon">
                        🔍
                    </div>

                    <h2>
                        No movies found
                    </h2>

                    <p>
                        We couldn't find any movies
                        matching "{search}".
                    </p>

                    <p>
                        Try searching with another
                        movie name, genre, or keyword.
                    </p>

                </div>

            ) : (

                <div className="search-movie-grid">

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

export default SearchResults;