import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
    const {
        user,
        isAuthenticated,
        logout,
    } = useAuth();

    return (
        <nav className="navbar">

            <Link
                to="/"
                className="navbar-logo"
            >
                Stream<span>Sphere</span>
            </Link>


            <div className="navbar-search">
                <SearchBar />
            </div>


            <div className="navbar-links">

                <Link to="/">
                    Home
                </Link>

                <Link to="/category/Action">
                    Action
                </Link>

                <Link to="/category/Thriller">
                    Thriller
                </Link>

                <Link to="/category/Romantic">
                    Romantic
                </Link>


                {isAuthenticated ? (

                    <div className="navbar-user-section">

                        {/* ADMIN ONLY */}

                        {user?.role === "admin" && (
                            <Link
                                to="/admin"
                                className="admin-nav-link"
                            >
                                Admin Dashboard
                            </Link>
                        )}


                        <Link to="/subscription">
                            Premium
                        </Link>


                        <span className="navbar-user">
                            {user?.name}
                        </span>


                        <button
                            className="logout-button"
                            onClick={logout}
                        >
                            Logout
                        </button>

                    </div>

                ) : (

                    <>

                        <Link to="/login">
                            Login
                        </Link>

                        <Link to="/register">
                            Register
                        </Link>

                    </>

                )}

            </div>

        </nav>
    );
}

export default Navbar;