import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
    return (
        <footer className="footer">

            <div className="footer-container">

                {/* BRAND */}

                <div className="footer-brand">

                    <Link
                        to="/"
                        className="footer-logo"
                    >
                        Stream<span>Sphere</span>
                    </Link>

                    <p>
                        Premium entertainment,
                        made simple.
                    </p>

                    <p className="footer-description">
                        Discover movies, explore new
                        stories, and enjoy premium
                        streaming with StreamSphere.
                    </p>

                </div>


                {/* EXPLORE */}

                <div className="footer-column">

                    <h3>
                        Explore
                    </h3>

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

                    <Link to="/category/Sci-Fi">
                        Sci-Fi
                    </Link>

                </div>


                {/* ACCOUNT */}

                <div className="footer-column">

                    <h3>
                        Account
                    </h3>

                    <Link to="/login">
                        Login
                    </Link>

                    <Link to="/register">
                        Register
                    </Link>

                    <Link to="/subscription">
                        Premium
                    </Link>

                </div>


                {/* INFORMATION */}

                <div className="footer-column">

                    <h3>
                        StreamSphere
                    </h3>

                    <Link to="/">
                        About Us
                    </Link>

                    <Link to="/">
                        Help Center
                    </Link>

                    <Link to="/">
                        Privacy Policy
                    </Link>

                    <Link to="/">
                        Terms of Service
                    </Link>

                </div>

            </div>


            {/* BOTTOM */}

            <div className="footer-bottom">

                <p>
                    © 2026 StreamSphere.
                    All rights reserved.
                </p>

                <p>
                    Built as a portfolio project.
                </p>

            </div>

        </footer>
    );
}

export default Footer;