import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import axios from "axios";

import { getProfile } from "../services/authService";

const AuthContext = createContext();

function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    const [isAuthenticated, setIsAuthenticated] =
        useState(
            !!localStorage.getItem("accessToken")
        );

    const [loading, setLoading] = useState(true);

    const login = (userData, token) => {
        localStorage.setItem(
            "accessToken",
            token
        );

        setUser(userData);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem("accessToken");

        setUser(null);
        setIsAuthenticated(false);
    };

    const refreshUser = async () => {
        const token =
            localStorage.getItem("accessToken");

        if (!token) {
            return;
        }

        try {
            const response = await axios.get(
                "http://localhost:5000/api/v1/auth/profile",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setUser(response.data.user);
            setIsAuthenticated(true);

        } catch (error) {
            console.error(
                "Failed to refresh user:",
                error
            );

            logout();
        }
    };

    useEffect(() => {
        const restoreUser = async () => {
            const token =
                localStorage.getItem("accessToken");

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const data = await getProfile();

                setUser(data.user);
                setIsAuthenticated(true);

            } catch (error) {
                console.error(
                    "Failed to restore user:",
                    error
                );

                localStorage.removeItem(
                    "accessToken"
                );

                setUser(null);
                setIsAuthenticated(false);

            } finally {
                setLoading(false);
            }
        };

        restoreUser();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                loading,
                login,
                logout,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;

export function useAuth() {
    return useContext(AuthContext);
}