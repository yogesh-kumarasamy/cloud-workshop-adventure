const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());
app.use(cors()); // enable CORS for all routes

function filterQuestions(questions) {
    return questions.map(({ correctAnswer, ...questionWithoutAnswer }) => questionWithoutAnswer);
}
// Endpoint to fetch all questionnaires
app.get('/api/questionnaires', (req, res) => {
  const filePath = path.join(__dirname, 'data/questionnaires.json');
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    try {
      const questionnaires = JSON.parse(data);
      const filteredQuestionnaires = questionnaires.map(qn => ({
        ...qn,
        questions: filterQuestions(qn.questions)
    }));
    res.json(filteredQuestionnaires);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
});

// Endpoint to fetch a specific questionnaire by ID
// Endpoint to fetch a specific questionnaire by ID
app.get('/api/questionnaire/:id', (req, res) => {
  const filePath = path.join(__dirname, 'data/questionnaires.json');
  const questionnaireId = parseInt(req.params.id, 10);

  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    try {
      const questionnaires = JSON.parse(data);
      const questionnaire = questionnaires.find(q => q.id === questionnaireId);

      if (!questionnaire) {
        return res.status(404).json({ error: 'Questionnaire not found' });
      }

      // Filter out the correctAnswer property from the questions
      const filteredQuestionnaire = {
        ...questionnaire,
        questions: filterQuestions(questionnaire.questions)
      };

      res.json(filteredQuestionnaire);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
});

// Endpoint to evaluate quiz results and provide a summary of right and wrong answers
app.post('/api/results', (req, res) => {
  console.log('hitting');
    const { id, questions: userQuestions } = req.body;
    const filePath = path.join(__dirname, 'data/questionnaires.json');
  
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
        console.error('Error reading file:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      try {
        const questionnaires = JSON.parse(data);
        console.log('questionnaires', questionnaires, id);
        const questionnaire = questionnaires.find(q => q.id === id);
        console.log('questionnaire', questionnaire);
  
        if (!questionnaire) {
          console.log('coming inside');
          return res.status(404).json({ error: 'Questionnaire not found' });
        }
  
        let score = 0;
        const detailedResults = questionnaire.questions.map(question => {
          const userResponse = userQuestions.find(q => q.id === question.id);
          const answered = userResponse ? userResponse.answered : null;
          const isCorrect = answered === question.correctAnswer;
          if (isCorrect) {
            score++;
          }
          return {
            questionId: question.id,
            question: question.question,
            answered,
            isCorrect
          };
        });
  
        const summary = {
          totalQuestions: questionnaire.questions.length,
          rightAnswers: score,
          wrongAnswers: questionnaire.questions.length - score
        };
  
        res.json({ summary, detailedResults });
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });
  });

// Endpoint for login with static credentials
app.post('/api/login', (req, res) => {
    console.log(req.body);
    const { username, password } = req.body;
  
    // Static credentials
    const staticUsername = 'admin';
    const staticPassword = 'password123';
  
    if (username === staticUsername && password === staticPassword) {
      return res.json({
        message: 'Login successful',
        user: { username }
      });
    } else {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
  });  

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
