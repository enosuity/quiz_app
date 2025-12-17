import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const CreateQuiz = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [timeLimit, setTimeLimit] = useState(10);
    const [questions, setQuestions] = useState([]);
    const navigate = useNavigate();

    const addQuestion = () => {
        setQuestions([...questions, { text: '', question_type: 'multiple_choice', options: { a: '', b: '', c: '', d: '' }, correct_answer: '' }]);
    };

    const updateQuestion = (index, field, value) => {
        const newQuestions = [...questions];
        newQuestions[index][field] = value;
        setQuestions(newQuestions);
    };

    const updateOption = (qIndex, key, value) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[key] = value;
        setQuestions(newQuestions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // 1. Create Quiz
            const quizRes = await api.post('/quizzes', { quiz: { title, description, time_limit: timeLimit } });
            const quizId = quizRes.data.data.id;

            // 2. Create Questions
            for (const q of questions) {
                await api.post(`/quizzes/${quizId}/questions`, { question: q });
            }

            alert('Quiz created successfully!');
            navigate('/');
        } catch (error) {
            console.error(error);
            alert('Failed to create quiz');
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Create New Quiz</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Quiz Details */}
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Quiz Details</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Quiz Title</label>
                            <input type="text" placeholder="e.g. General Knowledge" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 rounded bg-gray-50 border border-gray-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none text-gray-900" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea placeholder="Briefly describe what this quiz is about..." value={description} onChange={e => setDescription(e.target.value)} className="w-full p-2 rounded bg-gray-50 border border-gray-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none text-gray-900" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Time Limit (minutes)</label>
                            <input type="number" placeholder="10" value={timeLimit} onChange={e => setTimeLimit(e.target.value)} className="w-full p-2 rounded bg-gray-50 border border-gray-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none text-gray-900" required />
                        </div>
                    </div>
                </div>

                {/* Questions */}
                <div className="space-y-4">
                    {questions.map((q, index) => (
                        <div key={index} className="bg-white p-6 rounded-xl shadow-md border border-gray-200 relative">
                            <h3 className="text-lg font-semibold mb-2 text-gray-700">Question {index + 1}</h3>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Question Text</label>
                                <input type="text" placeholder="e.g. What is the capital of France?" value={q.text} onChange={e => updateQuestion(index, 'text', e.target.value)} className="w-full p-2 mb-2 rounded bg-gray-50 border border-gray-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none text-gray-900" required />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Question Type</label>
                                <select value={q.question_type} onChange={e => updateQuestion(index, 'question_type', e.target.value)} className="w-full p-2 mb-2 rounded bg-gray-50 text-gray-900 border border-gray-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none">
                                    <option value="multiple_choice">Multiple Choice</option>
                                    <option value="true_false">True/False</option>
                                    <option value="text">Text</option>
                                </select>
                            </div>

                            {q.question_type === 'multiple_choice' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Options</label>
                                    <div className="grid grid-cols-2 gap-2 mb-2">
                                        {Object.keys(q.options).map(key => (
                                            <input key={key} type="text" placeholder={`Option ${key.toUpperCase()}`} value={q.options[key]} onChange={e => updateOption(index, key, e.target.value)} className="p-2 rounded bg-gray-50 border border-gray-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none text-gray-900" required />
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Correct Answer</label>
                                <input type="text" placeholder="e.g. 'c' for Option C, or 'true'" value={q.correct_answer} onChange={e => updateQuestion(index, 'correct_answer', e.target.value)} className="w-full p-2 rounded bg-gray-50 border border-gray-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none text-gray-900" required />
                                <p className="text-xs text-gray-500 mt-1">For Multiple Choice, enter the option letter (a, b, c, d). For True/False, enter 'true' or 'false'.</p>
                            </div>
                        </div>
                    ))}
                    <button type="button" onClick={addQuestion} className="w-full py-2 bg-sky-100 hover:bg-sky-200 text-sky-700 rounded-lg transition font-semibold border border-sky-200">Add Question</button>
                </div>

                <button type="submit" className="w-full py-3 bg-sky-600 hover:bg-sky-700 rounded-lg font-bold text-lg text-white shadow-lg">Save Quiz</button>
            </form>
        </div>
    );
};

export default CreateQuiz;
