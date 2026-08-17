import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Watch.css";

function Watch() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [movie, setMovie] = useState(null);
    const [videoUrl, setVideoUrl] = useState("");

    const [loading, setLoading] = useState(true);
    const [videoLoading, setVideoLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const token =
                    localStorage.getItem("accessToken");

                if (!token) {
                    navigate("/login");
                    return;
                }

                const response = await api.get(
                    `/movies/${id}/watch`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

                setMovie(response.data.movie);
                setVideoUrl(response.data.videoUrl);

            } catch (error) {
                console.error(error);

                const status =
                    error.response?.status;

                const message =
                    error.response?.data?.message ||
                    "Unable to access this video";

                if (status === 401) {
                    navigate("/login");
                    return;
                }

                setError(message);

            } finally {
                setLoading(false);
            }
        };

        fetchVideo();
    }, [id, navigate]);

    const handleVideoReady = () => {
        setVideoLoading(false);
    };

    const handleVideoError = () => {
        setVideoLoading(false);

        setError(
            "Unable to play this video. Please try again later."
        );
    };

    if (loading) {
        return (
            <div className="watch-loading">
                <p>Checking video access...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="watch-error">

                <h2>
                    Unable to Watch
                </h2>

                <p>
                    {error}
                </p>

                <button
                    onClick={() =>
                        navigate(`/movies/${id}`)
                    }
                >
                    Back to Movie
                </button>

            </div>
        );
    }

    return (
        <main className="watch-page">

            <div className="watch-container">

                <div className="video-container">

                    {videoLoading && (
                        <div className="video-loading">
                            Loading video...
                        </div>
                    )}

                    <video
                        className="video-player"
                        controls
                        controlsList="nodownload"
                        preload="metadata"
                        poster={movie?.thumbnail}
                        src={videoUrl}
                        onCanPlay={handleVideoReady}
                        onError={handleVideoError}
                    >
                        Your browser does not support
                        HTML5 video.
                    </video>

                </div>

                {movie && (
                    <div className="watch-info">

                        <h1>
                            {movie.title}
                        </h1>

                        <div className="watch-meta">

                            <span>
                                {movie.year}
                            </span>

                            <span>•</span>

                            <span>
                                {movie.duration}
                            </span>

                            <span>•</span>

                            <span>
                                ⭐ {movie.rating}
                            </span>

                            <span>•</span>

                            <span>
                                {movie.language}
                            </span>

                        </div>

                        <p>
                            {movie.description}
                        </p>

                    </div>
                )}

            </div>

        </main>
    );
}

export default Watch;