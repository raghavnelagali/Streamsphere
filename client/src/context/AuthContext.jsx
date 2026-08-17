import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import { getProfile } from "../services/authService";

const AuthContext = createContext();

function AuthProvider({ children }) {

    const [user, setUser] = useState(null);

    const [isAuthenticated, setIsAuthenticated] =
        useState(
            !!localStorage.getItem("accessToken")
        );

    const [loading, setLoading] = useState(true);


    /* LOGIN */

    const login = (userData, token) => {

        localStorage.setItem(
            "accessToken",
            token
        );

        setUser(userData);

        setIsAuthenticated(true);
    };


    /* LOGOUT */

    const logout = () => {

        localStorage.removeItem(
            "accessToken"
        );

        setUser(null);

        setIsAuthenticated(false);
    };


    /* REFRESH USER */

    const refreshUser = async () => {

        const token =
            localStorage.getItem(
                "accessToken"
            );

        if (!token) {
            return;
        }

        try {

            const data =
                await getProfile();

            setUser(data.user);

            setIsAuthenticated(true);

        } catch (error) {

            console.error(
                "Failed to refresh user:",
                error
            );

            logout();
        }
    };


    /* RESTORE USER WHEN APP STARTS */

    useEffect(() => {

        const restoreUser = async () => {

            const token =
                localStorage.getItem(
                    "accessToken"
                );

            if (!token) {

                setLoading(false);

                return;
            }

            try {

                const data =
                    await getProfile();

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