import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams, useLocation, Outlet, Navigate } from "react-router-dom";
import axios from "axios";

// Set Axios base URL globally
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

interface Question {
  id: number;
  question: string;
  options: string[];
}

interface Answer {
  id: number;
  answered: string;
}

interface Questionnaire {
  id: number;
  title: string;
}
const ProtectedRoute: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("authenticated");

  const handleLogout = () => {
    localStorage.removeItem("authenticated");
    navigate("/");
  };

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <header className="bg-gray-800 text-white p-4 flex justify-end">
        <button
          onClick={handleLogout}
          className="hover:underline"
        >
          Logout
        </button>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/login", { username, password });
      if (response.status === 200) {
        localStorage.setItem("authenticated", "true");
        navigate("/home");
      }
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-sm w-full">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="bg-blue-100 text-blue-800 p-4 rounded-lg mb-4">
            <p>
              <strong>Note:</strong> Use the following credentials:
            </p>
            <ul className="list-disc list-inside mt-2">
              <li>
                <strong>Username:</strong> admin
              </li>
              <li>
                <strong>Password:</strong> password123
              </li>
            </ul>
          </div>
          <div>
            <label className="block font-medium mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border rounded-lg p-2"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg p-2"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

const Home: React.FC = () => {
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestionnaires = async () => {
      try {
        const response = await axios.get("/api/questionnaires");
        setQuestionnaires(response.data);
      } catch (error) {
        console.error("Error fetching questionnaires:", error);
      }
    };

    fetchQuestionnaires();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-6">Available Questionnaires</h1>
      <div className="space-y-4 w-full max-w-lg">
        {questionnaires.map((q) => (
          <button
            key={q.id}
            onClick={() => navigate(`/questionnaire/${q.id}`)}
            className="block w-full bg-white shadow-md rounded-lg p-4 text-left hover:bg-gray-100"
          >
            {q.title}
          </button>
        ))}
      </div>
    </div>
  );
};

const QuestionnairePage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [title, setTitle] = useState("");
  const [questionnaireId, setQuestionnaireId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`/api/questionnaire/${id}`);
        if(id) setQuestionnaireId(Number(id));
        setTitle(response.data.title);
        setQuestions(response.data.questions);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, [id]);

  const handleOptionChange = (id: number, answered: string) => {
    setAnswers((prevAnswers) => {
      const existingAnswerIndex = prevAnswers.findIndex(
        (answer) => answer.id === id
      );

      if (existingAnswerIndex > -1) {
        const updatedAnswers = [...prevAnswers];
        updatedAnswers[existingAnswerIndex].answered = answered;
        return updatedAnswers;
      }

      return [...prevAnswers, { id, answered }];
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(`/api/results`, { id: questionnaireId, questions: answers });
      console.log(response);
      navigate(`/result/${id}`, { state: { result: response.data } });
    } catch (error) {
      console.error("Error submitting answers:", error);
      alert("Error submitting answers. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-6">{title}</h1>
      <div className="space-y-4 w-full max-w-lg">
        {questions.map((question, index) => (
          <div key={question.id} className="space-y-2">
            <h2 className="font-semibold">{index + 1}. {question.question}</h2>
            {question.options.map((option) => (
              <label key={option} className="block">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option}
                  onChange={() => handleOptionChange(question.id, option)}
                  checked={
                    answers.find(
                      (answer) => answer.id === question.id
                    )?.answered === option
                  }
                  className="mr-2"
                />
                {option}
              </label>
            ))}
          </div>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="mt-6 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </div>
  );
};

const ResultPage: React.FC = () => {
  const { state } = useLocation();

  const navigate = useNavigate();
  const { result } = state || {};

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No result found.</p>
      </div>
    );
  }

  const { summary, detailedResults } = result;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-4 text-center">
          Quiz Results Dashboard
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-100 p-4 rounded-lg text-center">
            <h2 className="text-xl font-semibold">Total Questions</h2>
            <p className="text-2xl mt-2">{summary.totalQuestions}</p>
          </div>
          <div className="bg-blue-100 p-4 rounded-lg text-center">
            <h2 className="text-xl font-semibold">Right Answers</h2>
            <p className="text-2xl mt-2">{summary.rightAnswers}</p>
          </div>
          <div className="bg-red-100 p-4 rounded-lg text-center">
            <h2 className="text-xl font-semibold">Wrong Answers</h2>
            <p className="text-2xl mt-2">{summary.wrongAnswers}</p>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-4">Detailed Results</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4 border border-gray-300">Question ID</th>
                <th className="py-2 px-4 border border-gray-300">Question</th>
                <th className="py-2 px-4 border border-gray-300">Your Answer</th>
                <th className="py-2 px-4 border border-gray-300">Result</th>
              </tr>
            </thead>
            <tbody>
              {detailedResults.map((detail: any) => (
                <tr key={detail.questionId} className="text-center">
                  <td className="py-2 px-4 border border-gray-300">
                    {detail.questionId}
                  </td>
                  <td className="py-2 px-4 border border-gray-300">
                    {detail.question}
                  </td>
                  <td className="py-2 px-4 border border-gray-300">
                    {detail.answered || "Not Answered"}
                  </td>
                  <td className="py-2 px-4 border border-gray-300">
                    {detail.isCorrect ? (
                      <span className="text-green-600 font-bold">Correct</span>
                    ) : (
                      <span className="text-red-600 font-bold">Incorrect</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center mt-10">
          <button
            onClick={() => navigate('/home')}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/questionnaire/:id" element={<QuestionnairePage />} />
          <Route path="/result/:id" element={<ResultPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
