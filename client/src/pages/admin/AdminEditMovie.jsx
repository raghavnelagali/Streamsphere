import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import "./AdminEditMovie.css";

function AdminEditMovie() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        genre: "",
        year: "",
        duration: "",
        rating: "",
        language: "",
    });

    const [thumbnail, setThumbnail] = useState(null);
    const [video, setVideo] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const response = await api.get(
                    `/movies/${id}`
                );

                const movie = response.data.movie;

                setFormData({
                    title: movie.title || "",
                    description: movie.description || "",
                    category: movie.category || "",
                    genre: movie.genre || "",
                    year: movie.year || "",
                    duration: movie.duration || "",
                    rating: movie.rating || "",
                    language: movie.language || "",
                });

            } catch (error) {
                console.error(error);

                setError(
                    error.response?.data?.message ||
                    "Unable to load movie"
                );

            } finally {
                setLoading(false);
            }
        };

        fetchMovie();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError("");

            const token =
                localStorage.getItem("accessToken");

            const data = new FormData();

            data.append("title", formData.title);
            data.append(
                "description",
                formData.description
            );
            data.append(
                "category",
                formData.category
            );
            data.append(
                "genre",
                formData.genre
            );
            data.append(
                "year",
                formData.year
            );
            data.append(
                "duration",
                formData.duration
            );
            data.append(
                "rating",
                formData.rating
            );
            data.append(
                "language",
                formData.language
            );

            // Add new thumbnail only if selected
            if (thumbnail) {
                data.append(
                    "thumbnail",
                    thumbnail
                );
            }

            // Add new video only if selected
            if (video) {
                data.append(
                    "video",
                    video
                );
            }

            await api.put(
                `/movies/${id}`,
                data,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            navigate("/admin/movies");

        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to update movie"
            );

        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <main className="admin-edit-page">
                <p className="admin-loading">
                    Loading movie...
                </p>
            </main>
        );
    }

    return (
        <main className="admin-edit-page">

            <div className="admin-edit-header">

                <div className="admin-edit-header-content">

                    <span className="admin-label">
                        STREAMSPHERE ADMIN
                    </span>

                    <h1>
                        Edit Movie
                    </h1>

                    <p>
                        Update movie information and media.
                    </p>

                </div>

                <button
                    type="button"
                    className="admin-back-button"
                    onClick={() =>
                        navigate("/admin/movies")
                    }
                >
                    ← Back to Movie Management
                </button>

            </div>


            <form
                className="admin-edit-form"
                onSubmit={handleSubmit}
            >

                {/* MOVIE INFORMATION */}

                <div className="admin-edit-section">

                    <h2>
                        Movie Information
                    </h2>

                    <div className="admin-edit-grid">

                        <div className="admin-edit-group full-width">

                            <label>
                                Movie Title
                            </label>

                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="admin-edit-group full-width">

                            <label>
                                Description
                            </label>

                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="5"
                                required
                            />

                        </div>


                        <div className="admin-edit-group">

                            <label>
                                Category
                            </label>

                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            >
                                <option value="">
                                    Select category
                                </option>

                                <option value="Action">
                                    Action
                                </option>

                                <option value="Thriller">
                                    Thriller
                                </option>

                                <option value="Romantic">
                                    Romantic
                                </option>

                                <option value="Comedy">
                                    Comedy
                                </option>

                                <option value="Drama">
                                    Drama
                                </option>

                                <option value="Sci-Fi">
                                    Sci-Fi
                                </option>

                            </select>

                        </div>


                        <div className="admin-edit-group">

                            <label>
                                Genre
                            </label>

                            <input
                                type="text"
                                name="genre"
                                value={formData.genre}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="admin-edit-group">

                            <label>
                                Release Year
                            </label>

                            <input
                                type="number"
                                name="year"
                                value={formData.year}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="admin-edit-group">

                            <label>
                                Duration
                            </label>

                            <input
                                type="text"
                                name="duration"
                                value={formData.duration}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="admin-edit-group">

                            <label>
                                Rating
                            </label>

                            <input
                                type="number"
                                name="rating"
                                value={formData.rating}
                                onChange={handleChange}
                                min="0"
                                max="10"
                                step="0.1"
                                required
                            />

                        </div>


                        <div className="admin-edit-group">

                            <label>
                                Language
                            </label>

                            <input
                                type="text"
                                name="language"
                                value={formData.language}
                                onChange={handleChange}
                                required
                            />

                        </div>

                    </div>

                </div>


                {/* MEDIA REPLACEMENT */}

                <div className="admin-edit-section">

                    <h2>
                        Replace Movie Media
                    </h2>

                    <p className="media-help-text">
                        Leave these fields empty if you
                        want to keep the existing media.
                    </p>

                    <div className="admin-edit-grid">

                        {/* THUMBNAIL */}

                        <div className="admin-edit-group">

                            <label>
                                New Thumbnail
                            </label>

                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    setThumbnail(
                                        e.target.files[0]
                                    )
                                }
                            />

                            <small>
                                Select only if you want
                                to replace the existing
                                thumbnail.
                            </small>

                        </div>


                        {/* VIDEO */}

                        <div className="admin-edit-group">

                            <label>
                                New Video
                            </label>

                            <input
                                type="file"
                                accept="video/*"
                                onChange={(e) =>
                                    setVideo(
                                        e.target.files[0]
                                    )
                                }
                            />

                            <small>
                                Select only if you want
                                to replace the existing
                                video.
                            </small>

                        </div>

                    </div>

                </div>


                {/* PREMIUM NOTICE */}

                <div className="admin-edit-media-info">

                    <span>
                        ★
                    </span>

                    <div>

                        <strong>
                            Premium Movie
                        </strong>

                        <p>
                            All StreamSphere movies are
                            premium content. Replacing
                            media creates a new Cloudinary
                            URL and updates the movie.
                        </p>

                    </div>

                </div>


                {/* ERROR */}

                {error && (
                    <div className="admin-edit-error">
                        {error}
                    </div>
                )}


                {/* ACTIONS */}

                <div className="admin-edit-actions">

                    <button
                        type="button"
                        className="admin-edit-cancel"
                        onClick={() =>
                            navigate("/admin/movies")
                        }
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="admin-edit-save"
                        disabled={saving}
                    >
                        {saving
                            ? "Saving..."
                            : "Save Changes"}
                    </button>

                </div>

            </form>

        </main>
    );
}

export default AdminEditMovie;