import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/authService";
import "./Auth.css";

function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const validateForm = () => {
        const trimmedName = name.trim();
        const trimmedEmail = email.trim();

        // Name
        if (!trimmedName) {
            return "Name is required";
        }

        if (trimmedName.length < 2) {
            return "Name must contain at least 2 characters";
        }

        if (trimmedName.length > 50) {
            return "Name must not exceed 50 characters";
        }

        const nameRegex = /^[A-Za-z ]+$/;

        if (!nameRegex.test(trimmedName)) {
            return "Name can contain only letters and spaces";
        }

        // Email
        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(trimmedEmail)) {
            return "Please enter a valid email address";
        }

        // Password
        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (!passwordRegex.test(password)) {
            return "Password must be at least 8 characters and contain uppercase, lowercase, number and special character";
        }

        // Confirm password
        if (password !== confirmPassword) {
            return "Passwords do not match";
        }

        return "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        const validationError = validateForm();

        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            setLoading(true);

            await registerUser({
                name: name.trim(),
                email: email.trim().toLowerCase(),
                password,
            });

            navigate("/login");

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Registration failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="auth-page">

            <div className="auth-card">

                <div className="auth-header">

                    <div className="auth-logo">
                        Stream<span>Sphere</span>
                    </div>

                    <h1>
                        Create your account
                    </h1>

                    <p>
                        Join StreamSphere and start
                        watching premium movies.
                    </p>

                </div>

                {error && (
                    <div className="auth-error">
                        {error}
                    </div>
                )}

                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                >

                    {/* NAME */}

                    <div className="auth-field">

                        <label>
                            Name
                        </label>

                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                            required
                        />

                    </div>


                    {/* EMAIL */}

                    <div className="auth-field">

                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            required
                        />

                    </div>


                    {/* PASSWORD */}

                    <div className="auth-field">

                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            placeholder="Create a password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            required
                        />

                        <small className="password-help">
                            Minimum 8 characters with
                            uppercase, lowercase, number
                            and special character.
                        </small>

                    </div>


                    {/* CONFIRM PASSWORD */}

                    <div className="auth-field">

                        <label>
                            Confirm Password
                        </label>

                        <input
                            type="password"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(
                                    e.target.value
                                )
                            }
                            required
                        />

                    </div>


                    <button
                        className="auth-button"
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating Account..."
                            : "Create Account"}
                    </button>

                </form>


                <div className="auth-footer">

                    <p>
                        Already have an account?
                    </p>

                    <Link to="/login">
                        Login
                    </Link>

                </div>

            </div>

        </main>
    );
}

export default Register;