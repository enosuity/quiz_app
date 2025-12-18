import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const TakeQuiz = () => {
    const { id } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [timer, setTimer] = useState(0);
    const [timeUp, setTimeUp] = useState(false);

    // Countdown timer effect
    useEffect(() => {
        if (timer > 0 && !result) {
            const interval = setInterval(() => {
                setTimer(prev => {
                    if (prev <= 1) {
                        setTimeUp(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [timer, result]);

    // Auto-submit when time is up
    useEffect(() => {
        if (timeUp && !result) {
            const autoSubmit = async () => {
                try {
                    await api.post(`/quizzes/${id}/attempts`, { answers });
                    navigate('/'); // Redirect to dashboard
                } catch (error) {
                    console.error("Auto-submit failed:", error);
                    navigate('/'); // Still redirect even if submission fails
                }
            };
            autoSubmit();
        }
    }, [timeUp, result, answers, id, navigate]);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const res = await api.get(`/quizzes/${id}`);
                const quizData = res.data.data;
                const included = res.data.included || [];

                // Map included questions to quiz
                const questions = included
                    .filter(item => item.type === 'question')
                    .map(item => item.attributes);

                // Sort questions by ID to ensure consistent order
                questions.sort((a, b) => a.id - b.id);

                setQuiz({ ...quizData, attributes: { ...quizData.attributes, questions } });
                setTimer(quizData.attributes.time_limit * 60);
            } catch (error) {
                console.error("Failed to fetch quiz", error);
            } finally {
                setLoading(false);
            }
        };
        fetchQuiz();
    }, [id]);

    const handleAnswerChange = (questionId, value) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitting answers:", answers);
        try {
            const res = await api.post(`/quizzes/${id}/attempts`, { answers });
            console.log("Submission response:", res.data);
            setResult(res.data.data);
        } catch (error) {
            console.error("Failed to submit quiz", error);
            alert("Failed to submit quiz");
        }
    };

    if (loading) return <div className="text-white text-center mt-20">Loading...</div>;
    if (!quiz) return <div className="text-white text-center mt-20">Quiz not found</div>;

    if (result) {
        return (
            <div className="p-8 max-w-2xl mx-auto text-center">
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                    <h2 className="text-4xl font-bold mb-4 text-gray-800">Quiz Completed!</h2>
                    <p className="text-2xl text-sky-600 mb-8">Your Score: {result?.attributes?.score ?? 0}</p>

                    <div className="text-left space-y-6">
                        <h3 className="text-xl font-bold text-gray-700 border-b pb-2">Review Answers</h3>
                        {result?.attributes?.detailed_results?.map((item, index) => (
                            <div key={item.question_id} className={`p-4 rounded-lg border ${item.is_correct ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                                <p className="font-semibold text-gray-800 mb-2">{index + 1}. {item.text}</p>
                                <div className="text-sm">
                                    <p className="mb-1">
                                        <span className="font-medium">Your Answer: </span>
                                        <span className={item.is_correct ? 'text-green-700' : 'text-red-700'}>
                                            {item.question_type === 'multiple_choice' ? item.options[item.user_answer] || 'None' : item.user_answer || 'None'}
                                        </span>
                                    </p>
                                    {!item.is_correct && (
                                        <p>
                                            <span className="font-medium text-gray-600">Correct Answer: </span>
                                            <span className="text-green-700 font-medium">
                                                {item.question_type === 'multiple_choice' ? item.options[item.correct_answer] : item.correct_answer}
                                            </span>
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <button onClick={() => navigate('/')} className="mt-8 px-6 py-2 bg-sky-600 rounded-lg text-white hover:bg-sky-700 transition shadow-md">Back to Home</button>
                </div>
            </div>
        );
    }


    return (
        <div className="p-8 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-2 text-gray-800">{quiz.attributes.title}</h1>
            <p className="text-gray-600 mb-6">{quiz.attributes.description}</p>
            <div className="mb-4 p-4 bg-sky-50 border border-sky-200 rounded-lg flex justify-between items-center">
                <p className="text-gray-600">Time Limit: {quiz.attributes.time_limit} minutes</p>
                <div className={`text-2xl font-bold ${timer <= 60 ? 'text-red-600 animate-pulse' : 'text-sky-600'}`}>
                    {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
                </div>
            </div>


            <form onSubmit={handleSubmit} className="space-y-6">
                {quiz.attributes.questions.map((q, index) => (
                    <div key={q.id} className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                        <h3 className="text-xl font-semibold mb-4 text-gray-800">{index + 1}. {q.text}</h3>

                        {q.question_type === 'multiple_choice' && (
                            <div className="space-y-2">
                                {Object.entries(q.options).map(([key, value]) => (
                                    <label key={key} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-sky-50 cursor-pointer transition border border-transparent hover:border-sky-100">
                                        <input
                                            type="radio"
                                            name={`question-${q.id}`}
                                            value={key}
                                            onChange={() => handleAnswerChange(q.id, key)}
                                            checked={answers[q.id] === key}
                                            className="form-radio text-sky-600 focus:ring-sky-500 bg-gray-100 border-gray-300"
                                        />
                                        <span className="text-gray-700">{value}</span>
                                    </label>
                                ))}
                            </div>
                        )}

                        {q.question_type === 'true_false' && (
                            <div className="space-y-2">
                                {['true', 'false'].map(opt => (
                                    <label key={opt} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-sky-50 cursor-pointer transition border border-transparent hover:border-sky-100">
                                        <input
                                            type="radio"
                                            name={`question-${q.id}`}
                                            value={opt}
                                            onChange={() => handleAnswerChange(q.id, opt)}
                                            checked={answers[q.id] === opt}
                                            className="form-radio text-sky-600 focus:ring-sky-500 bg-gray-100 border-gray-300"
                                        />
                                        <span className="text-gray-700 capitalize">{opt}</span>
                                    </label>
                                ))}
                            </div>
                        )}

                        {q.question_type === 'text' && (
                            <input
                                type="text"
                                className="w-full p-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
                                placeholder="Type your answer..."
                                value={answers[q.id] || ''}
                                onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                            />
                        )}
                    </div>
                ))}

                <button type="submit" className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-lg font-bold text-lg text-white shadow-lg transition transform hover:scale-[1.02]">
                    Submit Quiz
                </button>
            </form>
        </div>
    );
};

export default TakeQuiz;
