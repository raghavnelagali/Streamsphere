import { useEffect, useState } from "react";
import { getMovies } from "../services/movieService";

import Hero from "../components/Hero";
import MovieRow from "../components/MovieRow";

function Home() {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const data = await getMovies();

                setMovies(data.movies);
            } catch (error) {
                console.error(error);
            }
        };

        fetchMovies();
    }, []);

    const featuredMovie = movies.find(
        (movie) => movie.featured
    );

    const trendingMovies = movies.filter(
        (movie) => movie.trending
    );

    const actionMovies = movies.filter(
        (movie) => movie.category === "Action"
    );

    const thrillerMovies = movies.filter(
        (movie) => movie.category === "Thriller"
    );

    const sciFiMovies = movies.filter(
        (movie) => movie.category === "Sci-Fi"
    );

    const romanticMovies = movies.filter(
        (movie) => movie.category === "Romantic"
    );

    const comedyMovies = movies.filter(
        (movie) => movie.category === "Comedy"
    );

    const dramaMovies = movies.filter(
        (movie) => movie.category === "Drama"
    );

    return (
        <div className="home">

            <Hero movie={featuredMovie} />

            <div className="home-content">

                <MovieRow
                    title="Trending Now"
                    movies={trendingMovies}
                />

                <MovieRow
                    title="Action"
                    movies={actionMovies}
                />

                <MovieRow
                    title="Thriller"
                    movies={thrillerMovies}
                />

                <MovieRow
                    title="Sci-Fi"
                    movies={sciFiMovies}
                />

                <MovieRow
                    title="Romantic"
                    movies={romanticMovies}
                />

                <MovieRow
                    title="Comedy"
                    movies={comedyMovies}
                />

                <MovieRow
                    title="Drama"
                    movies={dramaMovies}
                />

            </div>

        </div>
    );
}

export default Home;