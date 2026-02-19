import { useState } from "react";
import { createPortal } from "react-dom";
import { X, Loader2, AlertCircle, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
    const { user, login, register, logout } = useAuth();
    const [mode, setMode] = useState<"login" | "signup">("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const resetForm = () => {
        setEmail("");
        setPassword("");
        setFirstName("");
        setLastName("");
        setConfirmPassword("");
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (mode === "signup") {
            if (!firstName.trim() || !lastName.trim()) {
                setError("Please enter your first and last name.");
                return;
            }
            if (password !== confirmPassword) {
                setError("Passwords do not match.");
                return;
            }
            if (password.length < 6) {
                setError("Password must be at least 6 characters.");
                return;
            }
        }

        setIsLoading(true);

        try {
            let result;
            if (mode === "login") {
                result = await login(email, password);
            } else {
                result = await register(firstName, lastName, email, password);
            }

            if (result.success) {
                resetForm();
                onClose();
            } else {
                setError(result.message || "Something went wrong.");
            }
        } catch {
            setError("An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    const switchMode = () => {
        setMode(mode === "login" ? "signup" : "login");
        resetForm();
    };

    const handleLogout = () => {
        logout();
        onClose();
    };

    // If user is logged in, show account info
    if (user) {
        return createPortal(
            <div className="fixed inset-0 z-[100] flex items-center justify-center">
                <div
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    onClick={onClose}
                />
                <div className="relative bg-white w-full max-w-md mx-4" style={{ animation: "fadeInUp 0.3s ease-out" }}>
                    <button
                        onClick={onClose}
                        className="absolute top-5 right-5 p-1.5 text-black/40 hover:text-black transition-colors z-10"
                        aria-label="Close"
                    >
                        <X size={18} />
                    </button>

                    <div className="px-8 py-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center">
                                <span className="text-lg font-light text-black">
                                    {user.firstName[0]}{user.lastName[0]}
                                </span>
                            </div>
                            <div>
                                <h2 className="text-lg font-light text-black">
                                    {user.firstName} {user.lastName}
                                </h2>
                                <p className="text-sm text-black/50">{user.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 text-green-700 text-sm rounded-none mb-6">
                            <Check className="h-4 w-4 flex-shrink-0" />
                            <span>You're signed in</span>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="w-full py-3 border border-black/15 text-sm font-light text-black hover:bg-black/[0.02] transition-colors duration-200"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>

                <style>{`
                    @keyframes fadeInUp {
                      from { opacity: 0; transform: translateY(16px); }
                      to { opacity: 1; transform: translateY(0); }
                    }
                `}</style>
            </div>,
            document.body
        );
    }

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white w-full max-w-md mx-4" style={{ animation: "fadeInUp 0.3s ease-out" }}>
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 p-1.5 text-black/40 hover:text-black transition-colors z-10"
                    aria-label="Close"
                >
                    <X size={18} />
                </button>

                {/* Header */}
                <div className="px-8 pt-10 pb-2">
                    <h2 className="text-xl font-light text-black tracking-wide">
                        {mode === "login" ? "Welcome Back" : "Create Account"}
                    </h2>
                    <p className="text-sm font-light text-black/50 mt-1">
                        {mode === "login"
                            ? "Sign in to access your account"
                            : "Join us for an elevated shopping experience"}
                    </p>
                </div>

                {/* Divider */}
                <div className="px-8 pt-4 pb-2">
                    <div className="h-px bg-black/10" />
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-8 pb-8 pt-2 space-y-4">
                    {mode === "signup" && (
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-light text-black/60 mb-1.5 uppercase tracking-wider">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="w-full px-4 py-3 border border-black/15 text-sm font-light text-black placeholder:text-black/30 outline-none focus:border-black/40 transition-colors"
                                    placeholder="First name"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-light text-black/60 mb-1.5 uppercase tracking-wider">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="w-full px-4 py-3 border border-black/15 text-sm font-light text-black placeholder:text-black/30 outline-none focus:border-black/40 transition-colors"
                                    placeholder="Last name"
                                    required
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-light text-black/60 mb-1.5 uppercase tracking-wider">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-black/15 text-sm font-light text-black placeholder:text-black/30 outline-none focus:border-black/40 transition-colors"
                            placeholder="your@email.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-light text-black/60 mb-1.5 uppercase tracking-wider">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-black/15 text-sm font-light text-black placeholder:text-black/30 outline-none focus:border-black/40 transition-colors"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {mode === "signup" && (
                        <div>
                            <label className="block text-xs font-light text-black/60 mb-1.5 uppercase tracking-wider">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-black/15 text-sm font-light text-black placeholder:text-black/30 outline-none focus:border-black/40 transition-colors"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    )}

                    {mode === "login" && (
                        <div className="text-right">
                            <button type="button" className="text-xs font-light text-black/50 hover:text-black transition-colors">
                                Forgot password?
                            </button>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-none">
                            <AlertCircle className="h-4 w-4 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 bg-black text-white text-sm font-light tracking-wider hover:bg-black/85 transition-colors duration-200 mt-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                {mode === "login" ? "Signing In..." : "Creating Account..."}
                            </>
                        ) : (
                            mode === "login" ? "Sign In" : "Create Account"
                        )}
                    </button>

                    {/* Switch mode */}
                    <p className="text-center text-sm font-light text-black/50 pt-2">
                        {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
                        <button
                            type="button"
                            onClick={switchMode}
                            className="text-black hover:text-black/70 transition-colors underline underline-offset-2"
                        >
                            {mode === "login" ? "Create one" : "Sign in"}
                        </button>
                    </p>
                </form>
            </div>

            <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
        </div>,
        document.body
    );
};

export default AuthModal;
