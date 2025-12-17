import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const response = await api.get('/quizzes');
                setQuizzes(response.data.data);
            } catch (error) {
                console.error('Error fetching quizzes:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuizzes();
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-slate-50 text-sky-600">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Navbar */}
            <nav className="bg-white shadow-sm border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-sky-600">Quiz App</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-slate-600">Welcome, {user?.email}</span>
                            {user?.admin && (
                                <span className="bg-sky-100 text-sky-800 text-xs px-2 py-1 rounded-full font-semibold">
                                    Admin
                                </span>
                            )}
                            <button
                                onClick={handleLogout}
                                className="text-slate-500 hover:text-red-500 transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-slate-800">Available Quizzes</h2>
                    {user?.admin && (
                        <Link
                            to="/create-quiz"
                            className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors flex items-center"
                        >
                            <span className="mr-2">+</span> Create New Quiz
                        </Link>
                    )}
                </div>

                {quizzes.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-slate-100">
                        <p className="text-slate-500 text-lg">No quizzes available yet.</p>
                        {user?.admin && (
                            <p className="text-slate-400 mt-2">Create one to get started!</p>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {quizzes.map((quiz) => (
                            <div
                                key={quiz.id}
                                className="bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-200 overflow-hidden"
                            >
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-slate-800 mb-2">
                                        {quiz.attributes.title}
                                    </h3>
                                    <p className="text-slate-600 mb-4 line-clamp-2">
                                        {quiz.attributes.description}
                                    </p>
                                    <div className="flex justify-between items-center text-sm text-slate-500 mb-6">
                                        <span className="flex items-center">
                                            <svg
                                                className="w-4 h-4 mr-1"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                            {quiz.attributes.time_limit} mins
                                        </span>
                                    </div>
                                    <Link
                                        to={`/quiz/${quiz.id}`}
                                        className="block w-full text-center bg-slate-100 hover:bg-sky-50 text-sky-600 font-semibold py-2 px-4 rounded-lg transition-colors border border-transparent hover:border-sky-200"
                                    >
                                        Start Quiz
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
