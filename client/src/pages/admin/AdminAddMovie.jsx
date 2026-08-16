import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminAddMovie.css";

function AdminAddMovie() {
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

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

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
            setLoading(true);
            setError("");

            if (!thumbnail) {
                setError("Please select a thumbnail");
                setLoading(false);
                return;
            }

            if (!video) {
                setError("Please select a video");
                setLoading(false);
                return;
            }

            const data = new FormData();

            data.append("title", formData.title);
            data.append("description", formData.description);
            data.append("category", formData.category);
            data.append("genre", formData.genre);
            data.append("year", formData.year);
            data.append("duration", formData.duration);
            data.append("rating", formData.rating);
            data.append("language", formData.language);

            data.append("thumbnail", thumbnail);
            data.append("video", video);

            const token =
                localStorage.getItem("accessToken");

            await axios.post(
                "http://localhost:5000/api/v1/movies",
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
                "Failed to create movie"
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="admin-add-page">

            <div className="admin-add-header">

                <div className="admin-add-header-content">

                    <span className="admin-label">
                        STREAMSPHERE ADMIN
                    </span>

                    <h1>
                        Add New Movie
                    </h1>

                    <p>
                        Add a premium movie to your
                        StreamSphere catalog.
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
                className="admin-movie-form"
                onSubmit={handleSubmit}
            >

                <div className="admin-form-section">

                    <h2>
                        Movie Information
                    </h2>

                    <div className="admin-form-grid">

                        <div className="admin-form-group full-width">

                            <label>
                                Movie Title
                            </label>

                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Enter movie title"
                                required
                            />

                        </div>


                        <div className="admin-form-group full-width">

                            <label>
                                Description
                            </label>

                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Enter movie description"
                                rows="5"
                                required
                            />

                        </div>


                        <div className="admin-form-group">

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


                        <div className="admin-form-group">

                            <label>
                                Genre
                            </label>

                            <input
                                type="text"
                                name="genre"
                                value={formData.genre}
                                onChange={handleChange}
                                placeholder="Example: Action"
                                required
                            />

                        </div>


                        <div className="admin-form-group">

                            <label>
                                Release Year
                            </label>

                            <input
                                type="number"
                                name="year"
                                value={formData.year}
                                onChange={handleChange}
                                placeholder="2026"
                                required
                            />

                        </div>


                        <div className="admin-form-group">

                            <label>
                                Duration
                            </label>

                            <input
                                type="text"
                                name="duration"
                                value={formData.duration}
                                onChange={handleChange}
                                placeholder="2h 30m"
                                required
                            />

                        </div>


                        <div className="admin-form-group">

                            <label>
                                Rating
                            </label>

                            <input
                                type="number"
                                name="rating"
                                value={formData.rating}
                                onChange={handleChange}
                                placeholder="8.5"
                                min="0"
                                max="10"
                                step="0.1"
                                required
                            />

                        </div>


                        <div className="admin-form-group">

                            <label>
                                Language
                            </label>

                            <input
                                type="text"
                                name="language"
                                value={formData.language}
                                onChange={handleChange}
                                placeholder="English"
                                required
                            />

                        </div>

                    </div>

                </div>


                <div className="admin-form-section">

                    <h2>
                        Movie Media
                    </h2>

                    <div className="admin-form-grid">

                        <div className="admin-form-group">

                            <label>
                                Thumbnail
                            </label>

                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    setThumbnail(
                                        e.target.files[0]
                                    )
                                }
                                required
                            />

                            <small>
                                JPG, PNG or WEBP
                            </small>

                        </div>


                        <div className="admin-form-group">

                            <label>
                                Video
                            </label>

                            <input
                                type="file"
                                accept="video/*"
                                onChange={(e) =>
                                    setVideo(
                                        e.target.files[0]
                                    )
                                }
                                required
                            />

                            <small>
                                MP4 or supported video format
                            </small>

                        </div>

                    </div>

                </div>


                <div className="admin-premium-notice">

                    <div className="premium-notice-icon">
                        ★
                    </div>

                    <div>

                        <h3>
                            Premium Content
                        </h3>

                        <p>
                            All movies added through the
                            admin panel are automatically
                            marked as premium.
                        </p>

                    </div>

                </div>


                {error && (
                    <div className="admin-form-error">
                        {error}
                    </div>
                )}


                <div className="admin-form-actions">

                    <button
                        type="button"
                        className="admin-cancel-button"
                        onClick={() =>
                            navigate("/admin/movies")
                        }
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="admin-submit-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Uploading Movie..."
                            : "Add Movie"}
                    </button>

                </div>

            </form>

        </main>
    );
}

export default AdminAddMovie;