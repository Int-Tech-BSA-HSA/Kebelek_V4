// src/pages/PersonalTest.js

/*import React, { useState } from 'react';

function PersonalTest() {
  const [topic, setTopic] = useState('');
  const [questionsAndAnswers, setQuestionsAndAnswers] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [testFinished, setTestFinished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // NEW: For the final comparison results, advice, and suggested book
  const [comparisonResults, setComparisonResults] = useState([]);
  const [advice, setAdvice] = useState('');
  const [suggestedBook, setSuggestedBook] = useState('');

  // Handle generating questions based on the user-entered topic
  const handleGenerateQuestions = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3000/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response from backend:', errorText);
        setError(`Error: ${response.statusText} (${response.status})`);
        return;
      }

      const data = await response.json();
      if (data.questions) {
        setQuestionsAndAnswers(data.questions);
        setUserAnswers(Array(data.questions.length).fill(''));
        setTestFinished(false);
        setComparisonResults([]);
        setAdvice('');
        setSuggestedBook('');
      } else {
        setError('Unexpected response format.');
      }
    } catch (err) {
      console.error('Error generating questions:', err);
      setError('Failed to generate questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle user input for each question
  const handleUserAnswerChange = (index, value) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[index] = value;
    setUserAnswers(updatedAnswers);
  };

  // Finish test and reveal correct answers along with advice and book suggestion
  const handleFinishTest = async () => {
    // Immediately show correct answers in the UI
    setTestFinished(true);

    try {
      // Build a payload of question + correctAnswer + userAnswer
      const answersPayload = questionsAndAnswers.map((qa, index) => ({
        question: qa.question,
        correctAnswer: qa.answer,
        userAnswer: userAnswers[index],
      }));

      // Call the compare-answers endpoint
      const response = await fetch('http://localhost:3000/api/compare-answers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          answers: answersPayload
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response from backend:', errorText);
        setError(`Error: ${response.statusText} (${response.status})`);
        return;
      }

      const data = await response.json();

      // We expect data.comparisonResults, data.advice, data.suggestedBook
      if (data.comparisonResults && data.advice && data.suggestedBook) {
        setComparisonResults(data.comparisonResults);
        setAdvice(data.advice);
        setSuggestedBook(data.suggestedBook);
      } else {
        setError('Unexpected response format from compare-answers endpoint.');
      }
    } catch (err) {
      console.error('Error comparing answers:', err);
      setError('Failed to compare answers. Please try again.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <h1>Personal Test</h1>

      {/* Step 1: Topic Selection /}
      {!questionsAndAnswers.length && (
        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter your topic..."
            style={{ width: '70%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <button
            onClick={handleGenerateQuestions}
            style={{
              padding: '8px 16px',
              marginLeft: '10px',
              borderRadius: '4px',
              border: 'none',
              background: '#28a745',
              color: '#fff',
              cursor: 'pointer',
            }}
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Test'}
          </button>
        </div>
      )}

      {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}

      {/* Step 2: Questions and Answers /}
      {questionsAndAnswers.length > 0 && (
        <div>
          <h2>Answer the Questions Below</h2>
          {questionsAndAnswers.map((qa, index) => (
            <div
              key={index}
              style={{
                marginBottom: '20px',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                background: '#f9f9f9',
              }}
            >
              <p style={{ fontWeight: 'bold' }}>{index + 1}. {qa.question}</p>
              {/* User's answer input /}
              {!testFinished && (
                <input
                  type="text"
                  value={userAnswers[index] || ''}
                  onChange={(e) => handleUserAnswerChange(index, e.target.value)}
                  style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}
                  placeholder="Your answer..."
                />
              )}

              {/* If the test is finished, show correct answers and user answers /}
              {testFinished && (
                <div style={{ marginTop: '10px' }}>
                  <p><strong>Your Answer:</strong> {userAnswers[index] || 'No answer provided.'}</p>
                  <p><strong>Correct Answer:</strong> {qa.answer}</p>
                </div>
              )}
            </div>
          ))}

          {/* Finish Test Button /}
          {!testFinished && (
            <button
              onClick={handleFinishTest}
              style={{
                padding: '10px 20px',
                borderRadius: '4px',
                border: 'none',
                background: '#007bff',
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              Finish Test
            </button>
          )}

          {/* If we have comparisonResults, advice, and suggestedBook, display them /}
          {testFinished && comparisonResults.length > 0 && (
            <div style={{ marginTop: '30px' }}>
              <h2>Test Results</h2>
              <div style={{ marginBottom: '20px' }}>
                {comparisonResults.map((result, index) => (
                  <div
                    key={index}
                    style={{
                      marginBottom: '15px',
                      padding: '10px',
                      border: '1px solid #ccc',
                      borderRadius: '8px',
                      background: result.isCorrect ? '#d4edda' : '#f8d7da',
                    }}
                  >
                    <p style={{ fontWeight: 'bold' }}>{index + 1}. {result.question}</p>
                    <p><strong>Your Answer:</strong> {result.userAnswer}</p>
                    <p><strong>Correct Answer:</strong> {result.correctAnswer}</p>
                    <p><strong>Status:</strong> {result.isCorrect ? 'Correct' : 'Incorrect'}</p>
                    {!result.isCorrect && <p><strong>Reason:</strong> {result.reason}</p>}
                  </div>
                ))}
              </div>

              {/* Advice and Suggested Book *}
              <div style={{ padding: '15px', border: '1px solid #ccc', borderRadius: '8px', background: '#fff3cd' }}>
                <h3>Advice from ChatGPT:</h3>
                <p>{advice}</p>
                <h4>Suggested Book:</h4>
                <p>{suggestedBook}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PersonalTest;    */


// src/pages/PersonalTest.jsx

import React, { useState } from 'react';
import './PersonalTest.css'; // Import the CSS file

function PersonalTest() {
  const [topic, setTopic] = useState('');
  const [questionsAndAnswers, setQuestionsAndAnswers] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [testFinished, setTestFinished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // NEW: For the final comparison results, advice, and suggested book
  const [comparisonResults, setComparisonResults] = useState([]);
  const [advice, setAdvice] = useState('');
  const [suggestedBook, setSuggestedBook] = useState('');

  // Handle generating questions based on the user-entered topic
  const handleGenerateQuestions = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3000/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response from backend:', errorText);
        setError(`Error: ${response.statusText} (${response.status})`);
        return;
      }

      const data = await response.json();
      if (data.questions) {
        setQuestionsAndAnswers(data.questions);
        setUserAnswers(Array(data.questions.length).fill(''));
        setTestFinished(false);
        setComparisonResults([]);
        setAdvice('');
        setSuggestedBook('');
      } else {
        setError('Unexpected response format.');
      }
    } catch (err) {
      console.error('Error generating questions:', err);
      setError('Failed to generate questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle user input for each question
  const handleUserAnswerChange = (index, value) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[index] = value;
    setUserAnswers(updatedAnswers);
  };

  // Finish test and reveal correct answers along with advice and book suggestion
  const handleFinishTest = async () => {
    // Immediately show correct answers in the UI
    setTestFinished(true);

    try {
      // Build a payload of question + correctAnswer + userAnswer
      const answersPayload = questionsAndAnswers.map((qa, index) => ({
        question: qa.question,
        correctAnswer: qa.answer,
        userAnswer: userAnswers[index],
      }));

      // Call the compare-answers endpoint
      const response = await fetch('http://localhost:3000/api/compare-answers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          answers: answersPayload
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response from backend:', errorText);
        setError(`Error: ${response.statusText} (${response.status})`);
        return;
      }

      const data = await response.json();

      // We expect data.comparisonResults, data.advice, data.suggestedBook
      if (data.comparisonResults && data.advice && data.suggestedBook) {
        setComparisonResults(data.comparisonResults);
        setAdvice(data.advice);
        setSuggestedBook(data.suggestedBook);
      } else {
        setError('Unexpected response format from compare-answers endpoint.');
      }
    } catch (err) {
      console.error('Error comparing answers:', err);
      setError('Failed to compare answers. Please try again.');
    }
  };

  return (
    <div className="personal-test-container">
      <h1>Personal Test</h1>

      {/* Step 1: Topic Selection */}
      {!questionsAndAnswers.length && (
        <div className="form-group">
          <label htmlFor="topic">Enter a Topic</label>
          <input
            id="topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter your topic..."
            aria-label="Topic"
          />
        </div>
      )}

      {!questionsAndAnswers.length && (
        <div className="form-group">
          <button
            className={`button ${loading ? 'button-secondary' : ''}`}
            onClick={handleGenerateQuestions}
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Test'}
          </button>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      {/* Step 2: Questions and Answers */}
      {questionsAndAnswers.length > 0 && (
        <div>
          <h2>Answer the Questions Below</h2>
          {questionsAndAnswers.map((qa, index) => (
            <div
              key={index}
              className={`question-card ${testFinished ? 'finished' : ''}`}
            >
              <p><strong>{index + 1}. {qa.question}</strong></p>
              {/* User's answer textarea */}
              {!testFinished && (
                <textarea
                  id={`answer-${index}`}
                  aria-label={`Answer for question ${index + 1}`}
                  value={userAnswers[index] || ''}
                  onChange={(e) => handleUserAnswerChange(index, e.target.value)}
                  placeholder="Your answer..."
                ></textarea>
              )}

              {/* If the test is finished, show correct answers and user answers */}
              {testFinished && (
                <div className="result">
                  <p><strong>Your Answer:</strong> {userAnswers[index] || 'No answer provided.'}</p>
                  <p><strong>Correct Answer:</strong> {qa.answer}</p>
                </div>
              )}
            </div>
          ))}

          {/* Finish Test Button */}
          {!testFinished && (
            <div className="form-group">
              <button
                className="button button-secondary"
                onClick={handleFinishTest}
                disabled={loading}
              >
                Finish Test
              </button>
            </div>
          )}

          {/* If we have comparisonResults, advice, and suggestedBook, display them */}
          {testFinished && comparisonResults.length > 0 && (
            <div className="result-section">
              <h2>Test Results</h2>
              <div>
                {comparisonResults.map((result, index) => (
                  <div
                    key={index}
                    className={`comparison-card ${result.isCorrect ? 'correct' : 'incorrect'}`}
                  >
                    <p><strong>{index + 1}. {result.question}</strong></p>
                    <p><strong>Your Answer:</strong> {result.userAnswer}</p>
                    <p><strong>Correct Answer:</strong> {result.correctAnswer}</p>
                    <p><strong>Status:</strong> {result.isCorrect ? 'Correct' : 'Incorrect'}</p>
                    {!result.isCorrect && <p><strong>Reason:</strong> {result.reason}</p>}
                  </div>
                ))}
              </div>

              {/* Advice and Suggested Book */}
              <div className="advice-section">
                <h3>Advice from ChatGPT:</h3>
                <p>{advice}</p>
                <h4>Suggested Book:</h4>
                <p>{suggestedBook}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PersonalTest;
