import React, { useEffect, useState } from 'react';
import { fetchTriviaQuestions } from './triviaApi.js';

// Utility function to shuffle the answers array
const shuffleArray = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

function App() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const questionsPerPage = 5;

  useEffect(() => {
    const getQuestions = async () => {
      const fetchedQuestions = await fetchTriviaQuestions();

      // Shuffle the answers for each question, but do this only once
      const questionsWithShuffledAnswers = fetchedQuestions.map(question => {
        return {
          ...question,
          allAnswers: shuffleArray([question.correctAnswer, ...question.incorrectAnswers]),
        };
      });

      setQuestions(questionsWithShuffledAnswers);
      setLoading(false);
    };

    getQuestions();
  }, []);

  // Handle when an answer is selected
  const handleAnswerSelect = (questionId, answer, correctAnswer) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answer,
    });

    // Increment the score if the selected answer is correct
    if (answer === correctAnswer) {
      setScore(prevScore => prevScore + 1);
    }
  };

  // Handle the "Next" button click, and finish the quiz when all questions are answered
  const handleNext = () => {
    if (currentPage * questionsPerPage >= questions.length) {
      setQuizCompleted(true);
    } else {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  // Handle restarting the quiz
  const handleRestart = () => {
    setSelectedAnswers({});
    setScore(0);
    setCurrentPage(1);
    setQuizCompleted(false);
    setLoading(true);

    // Fetch the questions again to restart the quiz
    fetchTriviaQuestions().then(fetchedQuestions => {
      const questionsWithShuffledAnswers = fetchedQuestions.map(question => {
        return {
          ...question,
          allAnswers: shuffleArray([question.correctAnswer, ...question.incorrectAnswers]),
        };
      });
      setQuestions(questionsWithShuffledAnswers);
      setLoading(false);
    });
  };

  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = questions?.slice(indexOfFirstQuestion, indexOfLastQuestion) || [];

  // Check if all questions on the current page have been answered
  const allQuestionsAnswered = currentQuestions.every(question => selectedAnswers[question.id]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-xl">Loading...</div>;
  }

  if (quizCompleted) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center">
        <h1 className="text-4xl font-bold text-blue-600 mt-10 mb-5">Quiz Completed!</h1>
        <p className="text-2xl mb-6">Your Score: {score}/{questions.length}</p>

        <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-3xl mb-6">Review Your Answers:</h2>
          {questions.map((questionObj, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-xl font-semibold">{questionObj.question.text}</h3>
              <p className={`text-lg ${selectedAnswers[questionObj.id] === questionObj.correctAnswer ? 'text-green-500' : 'text-red-500'}`}>
                Your Answer: {selectedAnswers[questionObj.id]}
              </p>
              <p className="text-lg text-blue-500">Correct Answer: {questionObj.correctAnswer}</p>
            </div>
          ))}
        </div>

        <button onClick={handleRestart} className="mt-6 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg">
          Restart Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-blue-600 mt-10 mb-5">Trivia Quiz</h1>

      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
        {currentQuestions.length > 0 ? (
          currentQuestions.map((questionObj, index) => {
            return (
              <div key={index} className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">{questionObj.question.text}</h2>
                <div className="grid grid-cols-2 gap-4">
                  {questionObj.allAnswers.map((answer, i) => (
                    <button
                      key={i}
                      className={`bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors ${selectedAnswers[questionObj.id] === answer ? 'bg-green-500' : ''}`}
                      onClick={() => handleAnswerSelect(questionObj.id, answer, questionObj.correctAnswer)}
                      disabled={selectedAnswers[questionObj.id]}
                    >
                      {answer}
                    </button>
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <div>No questions available</div>
        )}
      </div>

      <div className="mt-6 flex justify-center w-full max-w-lg">
        <button
          onClick={handleNext}
          disabled={!allQuestionsAnswered}
          className={`px-6 py-2 rounded-lg text-white ${allQuestionsAnswered ? 'bg-blue-500 hover:bg-blue-600 cursor-pointer' : 'bg-gray-400 cursor-not-allowed'}`}
        >
          {currentPage * questionsPerPage >= questions.length ? 'Finish Quiz' : 'Next'}
        </button>
      </div>
    </div>
  );
}

export default App;
