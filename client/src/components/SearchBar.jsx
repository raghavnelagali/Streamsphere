import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SearchBar() {
    const [search, setSearch] = useState("");

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!search.trim()) {
            return;
        }

        navigate(
            `/movies?search=${encodeURIComponent(
                search.trim()
            )}`
        );
    };

    return (
        <form
            className="search-form"
            onSubmit={handleSubmit}
        >
            <input
                type="text"
                placeholder="Search movies..."
                value={search}
                onChange={(e) =>
                    setSearch(e.target.value)
                }
            />

            <button type="submit">
                Search
            </button>
        </form>
    );
}

export default SearchBar;