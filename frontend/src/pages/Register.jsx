import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [admin, setAdmin] = useState(false);
    const [error, setError] = useState('');
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (password !== passwordConfirmation) {
            setError("Passwords do not match");
            return;
        }
        const result = await signup(email, password, passwordConfirmation, admin);
        if (result.success) {
            navigate('/');
        } else {
            setError(result.error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-sky-50">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl border border-gray-100">
                <h2 className="text-3xl font-bold text-center text-gray-800">Create Account</h2>
                {error && <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 mt-1 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                            placeholder="you@example.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 mt-1 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                        <input
                            type="password"
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            className="w-full px-4 py-2 mt-1 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <div className="flex items-center">
                        <input
                            id="admin-checkbox"
                            type="checkbox"
                            checked={admin}
                            onChange={(e) => setAdmin(e.target.checked)}
                            className="w-4 h-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
                        />
                        <label htmlFor="admin-checkbox" className="ml-2 block text-sm text-gray-700">
                            Sign up as Admin
                        </label>
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg transition duration-200 shadow-md hover:shadow-lg"
                    >
                        Sign Up
                    </button>
                </form>
                <p className="text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-sky-600 hover:text-sky-700 font-medium">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
