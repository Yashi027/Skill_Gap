import React, { useState } from 'react';
import { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await login({ email, password });
            navigate("/");
        } catch (err) {
            setError(err.message || "Login failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-xl shadow border w-full max-w-md"
            >
                <h1 className="text-2xl font-bold mb-6">Log in to SkillGap</h1>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full p-3 border rounded-md mb-4 outline-none focus:ring-2 focus:ring-indigo-400"
                />

                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full p-3 border rounded-md mb-6 outline-none focus:ring-2 focus:ring-indigo-400"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-500 text-white py-3 rounded-md hover:bg-indigo-600 transition"
                >
                    {loading ? "Logging in..." : "Log in"}
                </button>

                <p className="text-sm text-gray-500 mt-4 text-center">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-indigo-600 hover:underline">
                        Sign up
                    </Link>
                </p>
            </form>
        </div>
    );
}

export default Login;
