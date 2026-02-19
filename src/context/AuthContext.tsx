import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { API_URL } from "@/lib/stripe";

export interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
    register: (firstName: string, lastName: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "sinea-auth-token";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem(TOKEN_KEY));
    const [isLoading, setIsLoading] = useState(!!localStorage.getItem(TOKEN_KEY));

    // On mount, if we have a saved token, fetch the current user
    useEffect(() => {
        if (token) {
            fetch(`${API_URL}/api/auth/me`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.success && data.data) {
                        setUser(data.data);
                    } else {
                        // Token expired or invalid
                        localStorage.removeItem(TOKEN_KEY);
                        setToken(null);
                    }
                })
                .catch(() => {
                    localStorage.removeItem(TOKEN_KEY);
                    setToken(null);
                })
                .finally(() => setIsLoading(false));
        }
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const res = await fetch(`${API_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();

            if (data.success && data.data) {
                setUser(data.data.user);
                setToken(data.data.token);
                localStorage.setItem(TOKEN_KEY, data.data.token);
                return { success: true };
            }

            return { success: false, message: data.message || "Login failed" };
        } catch {
            return { success: false, message: "Unable to connect to server" };
        }
    };

    const register = async (firstName: string, lastName: string, email: string, password: string) => {
        try {
            const res = await fetch(`${API_URL}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ firstName, lastName, email, password }),
            });
            const data = await res.json();

            if (data.success && data.data) {
                setUser(data.data.user);
                setToken(data.data.token);
                localStorage.setItem(TOKEN_KEY, data.data.token);
                return { success: true };
            }

            return { success: false, message: data.message || "Registration failed" };
        } catch {
            return { success: false, message: "Unable to connect to server" };
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem(TOKEN_KEY);
    };

    return (
        <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
