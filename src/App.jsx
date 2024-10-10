// src/App.jsx
import React, { useEffect, useState } from 'react';
import { fetchTriviaQuestions } from './triviaApi.js';

function App() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 5;

  useEffect(() => {
    const getQuestions = async () => {
      const fetchedQuestions = await fetchTriviaQuestions();
      setQuestions(fetchedQuestions);
      setLoading(false);
    };

    getQuestions();
  }, []);

  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = questions?.slice(indexOfFirstQuestion, indexOfLastQuestion) || [];

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-xl">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-blue-600 mt-10 mb-5">Trivia Quiz</h1>

      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
        {currentQuestions.length > 0 ? (
          currentQuestions.map((question, index) => (
            <div key={index} className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">{question.question}</h2>
              <div className="grid grid-cols-2 gap-4">
                {question.answers.map((answer, i) => (
                  <button
                    key={i}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    {answer}
                  </button>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div>No questions available</div>
        )}
      </div>

      <div className="mt-6 flex justify-between w-full max-w-lg">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          className={`px-6 py-2 rounded-lg text-white ${currentPage === 1 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
        >
          Previous
        </button>

        <button
          disabled={indexOfLastQuestion >= questions.length}
          onClick={() => setCurrentPage(currentPage + 1)}
          className={`px-6 py-2 rounded-lg text-white ${indexOfLastQuestion >= questions.length ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default App;
