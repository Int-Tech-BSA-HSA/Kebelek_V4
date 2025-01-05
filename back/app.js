import 'dotenv/config'; // Automatically loads .env
import fetch from 'node-fetch';
import express from 'express';
import cors from 'cors';
import logger from 'morgan';
import { spawn } from 'child_process';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; // Added import for JWT
//import ChatSaving from './models/Chat.js'; // rename import to avoid conflict

const app = express();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

// new: Chat schema
const chatSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: String,
  messages: [
    {
      role: String, // 'user' or 'assistant'
      content: String,
      timestamp: { type: Date, default: Date.now }
    }
  ]
});
const Chat = mongoose.model('Chat', chatSchema);

app.use(cors({
  origin: 'http://localhost:3001', // Adjust based on your frontend's URL and port
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(logger('dev'));
app.use(express.json());

// new: Auth middleware
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });
  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = decoded;
    next();
  });
}

// ------------------------------------------------------
// GET /api/hello
// Simple test endpoint to confirm server is running
// ------------------------------------------------------
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

/* 
|--------------------------------------------------------------------------
| POST /api/generate-questions
|--------------------------------------------------------------------------
| Generates 10 distinct short-answer questions (and answers) for a given topic
| using OpenAI GPT-4. Returns them in JSON format.
*/
app.post('/api/generate-questions', async (req, res) => {
  console.log('Request received at /api/generate-questions:', req.body);
  
  try {
    const { topic } = req.body;
    if (!topic) {
      return res.status(400).json({ error: 'No topic provided' });
    }

    // Prepare the refined prompt for OpenAI
    const openAIprompt = `
      Generate exactly 10 distinct, short-answer questions about ${topic}, 
      and provide short, correct answers for each. 
      Return only the JSON array in strict JSON format without any additional text or explanations.
      Ensure the JSON is valid and properly formatted, like this:
      [
        {"question": "What is ...?", "answer": "It is ..."},
        ...
      ]
    `;

    // Call OpenAI to generate the questions
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4", // or "gpt-3.5-turbo" if gpt-4 is not accessible
        messages: [
          {
            role: "system",
            content: "You are a helpful tutor that only provides short academic questions and answers in strict JSON format. Do not include any explanations or additional text."
          },
          {
            role: "user",
            content: openAIprompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    const data = await response.json();

    // Log the entire AI response for debugging
    console.log('AI Response:', JSON.stringify(data, null, 2));

    if (!data.choices || data.choices.length === 0) {
      return res.status(500).json({
        error: 'No valid response from AI',
        details: data
      });
    }

    // We'll store the parsed questions here
    let questionsArray = [];
    const content = data.choices[0].message?.content?.trim();

    if (!content) {
      return res.status(500).json({
        error: 'OpenAI returned an empty response.',
        details: data
      });
    }

    // Log the content before parsing
    console.log('AI Content:', content);

    // Attempt to extract JSON array using regex
    const jsonMatch = content.match(/\[.*\]/s);

    if (jsonMatch) {
      try {
        questionsArray = JSON.parse(jsonMatch[0]);
      } catch (parseError) {
        console.error('Failed to parse extracted JSON from AI:', parseError);
        return res.status(500).json({
          error: 'Could not parse the AI response as JSON',
          details: parseError.message,
          ai_response: content
        });
      }
    } else {
      console.error('No JSON array found in AI response.');
      return res.status(500).json({
        error: 'AI response does not contain a JSON array.',
        details: 'No JSON array detected in the AI response.',
        ai_response: content
      });
    }

    // Return the questions array as JSON
    res.json({ questions: questionsArray });
  } catch (error) {
    console.error('Error in /api/generate-questions route:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});


/*
|--------------------------------------------------------------------------
| POST /api/qa
|--------------------------------------------------------------------------
| Handles the Q&A chat with an OpenAI GPT-4 model. 
| Also optionally generates a Python-based graph in Base64 if relevant.
*/
app.post('/api/qa', async (req, res, next) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: 'No question provided' });
  }

  try {
    // Add a system message that sets the assistant's persona and guidelines
    const messages = [
      {
        role: "system",
        content: "You are a chemistry and biology lab assistant. You will only provide answers relevant to laboratory procedures, safety, chemical or biological concepts, stoichiometry, enzyme kinetics, equilibrium, thermodynamics, and related experiments. If the user asks something unrelated, politely refuse or guide them back to laboratory-related topics."
      },
      {
        role: "user",
        content: question
      }
    ];

    // Call OpenAI for the main Q&A
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: messages,
        max_tokens: 300,
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (data && data.choices && data.choices[0] && data.choices[0].message) {
      const answer = data.choices[0].message.content.trim();

      // Generate Python code for a relevant graph
      const pythonCodeResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content:
                "Create Python code that uses matplotlib to generate a relevant plot for the laboratory scenario. It must:\n" +
                "1) Import matplotlib.\n" +
                "2) Plot any relevant data.\n" +
                "3) Convert the figure to Base64 using io.BytesIO.\n" +
                "4) Print only the Base64, with no markdown or triple backticks.\n" +
                "Output only raw Python code, no text or formatting. Do not put triple backticks for code snippets as well. IT IS EXTREMELY IMPORTANT THAT YOU DO NOT PUT THE CODE IN CODE SNIPPETS INSIDE TRIPLE BACKTICKS. IT WILL BE SUPPLIED RIGHT AWAY TO AN EXECUTING ENVIRONMENT."
            },
            {
              role: "user",
              content: `${question}\nAssistant answer: ${answer}`
            }
          ],
          max_tokens: 300,
          temperature: 0.7
        })
      });

      const pythonData = await pythonCodeResponse.json();
      let base64Image = '';

      if (pythonData && pythonData.choices && pythonData.choices[0]) {
        // Extract Python code
        let pythonCode = pythonData.choices[0].message.content || "";
        // Remove any leftover triple backticks
        pythonCode = pythonCode.replace(/```(python)?/g, '').trim();

        // Log the Python code
        console.log('Python Code:', pythonCode);

        // Run the Python code to generate a graph in base64
        base64Image = await new Promise((resolve) => {
          const py = spawn('python3', ['-c', pythonCode]);
          let imageData = '';

          py.stdout.on('data', (data) => {
            imageData += data;
          });

          // Capture process errors
          py.stderr.on('data', (errData) => {
            console.error('Python error:', errData.toString());
          });

          py.on('close', () => {
            resolve(imageData.trim());
          });
        });
      }

      // Respond with the main Q&A and the (optional) graph
      res.json({
        answer,
        graph: base64Image
          ? `Here is your graph: <img src="data:image/png;base64,${base64Image}" alt="Experiment Graph"/>`
          : `No graph could be generated. Debug: ${pythonData?.choices?.[0]?.message?.content}`
      });
    } else {
      console.error('Unexpected response format:', data);
      res.status(500).json({ error: 'No valid response from AI' });
    }
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    next(error);
  }
});


//------------------------------------------------------
// POST /api/compare-answers
//------------------------------------------------------
// This route compares user answers with the correct answers.
// It calculates a score and optionally asks GPT-4 for suggestions.
app.post('/api/compare-answers', async (req, res) => {
  try {
    const { answers, topic } = req.body;
    // answers: [ { question, correctAnswer, userAnswer }, ... ]

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ error: 'Invalid answers array.' });
    }

    // We'll build an array of { question, correctAnswer, userAnswer, isCorrect, reason }
    const comparisonResults = [];

    // 1) Loop through each Q&A
    for (const item of answers) {
      const { question, correctAnswer, userAnswer } = item;

      // If userAnswer is blank, we'll skip GPT and mark isCorrect = false
      if (!userAnswer || userAnswer.trim() === '') {
        comparisonResults.push({
          question,
          correctAnswer,
          userAnswer,
          isCorrect: false,
          reason: 'No answer provided'
        });
        continue;
      }

      // Use GPT to see if it’s “essentially correct”
      const gptPrompt = `
        Correct answer: ${correctAnswer}
        Student answer: ${userAnswer}
        Are they essentially the same meaning, ignoring trivial differences?
        Return only strict JSON: {"isCorrect": true/false, "reason": "..."}.
      `;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4', // or 'gpt-3.5-turbo'
          messages: [
            {
              role: 'system',
              content: 'You are a strict but fair grader. Return JSON with { "isCorrect": boolean, "reason": string }.'
            },
            {
              role: 'user',
              content: gptPrompt
            }
          ],
          temperature: 0.0,
          max_tokens: 100
        })
      });

      const data = await response.json();
      // The GPT content might look like: {"isCorrect":true,"reason":"They match."}
      try {
        const aiObj = JSON.parse(data.choices[0].message.content.trim());
        comparisonResults.push({
          question,
          correctAnswer,
          userAnswer,
          isCorrect: aiObj.isCorrect,
          reason: aiObj.reason || ''
        });
      } catch (parseErr) {
        // If GPT didn't return valid JSON, default to incorrect
        comparisonResults.push({
          question,
          correctAnswer,
          userAnswer,
          isCorrect: false,
          reason: 'Parsing error from GPT'
        });
      }
    }

    // 2) Now we have an array of comparison results. Let’s ask GPT for advice and a book suggestion.
    // For example:
    const correctCount = comparisonResults.filter(r => r.isCorrect).length;
    const total = answers.length;

    const advicePrompt = `
      The student took a test on ${topic}. 
      They got ${correctCount} out of ${total} correct (roughly).
      Provide a short piece of advice on how they can improve, and suggest a specific book or resource for learning more about ${topic}.
      Return the advice in strict JSON format:
      {
        "advice": "...",
        "suggestedBook": "..."
      }
    `;

    let advice = '';
    let suggestedBook = '';

    // Optional: only call GPT if you have an API key
    if (process.env.OPENAI_API_KEY) {
      const adviceResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful tutor. Return strict JSON with advice and suggestedBook.'
            },
            {
              role: 'user',
              content: advicePrompt
            }
          ],
          max_tokens: 150,
          temperature: 0.7
        })
      });

      const adviceData = await adviceResponse.json();
      try {
        const adviceObj = JSON.parse(adviceData.choices[0].message.content.trim());
        advice = adviceObj.advice;
        suggestedBook = adviceObj.suggestedBook;
      } catch (e) {
        // fallback
        advice = 'Try reviewing your notes and practicing more questions.';
        suggestedBook = 'General reference: "Thermodynamics" by Cengel & Boles.';
      }
    } else {
      // fallback if no API key
      advice = 'Try reviewing your notes and practicing more questions.';
      suggestedBook = 'General reference: "Thermodynamics" by Cengel & Boles.';
    }

    // 3) Return the final results:
    res.json({
      comparisonResults, // array of Q&A correctness
      advice,
      suggestedBook
    });
  } catch (error) {
    console.error('Error in compare-answers route:', error);
    res.status(500).json({ error: 'Failed to compare answers', details: error.message });
  }
});

app.post('/api/register', async (req, res) => {
  console.log('Received /api/register request'); // Added log
  try {
    const { email, password } = req.body;

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already in use' });
    }

    // Validate email and password
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed });
    res.status(201).json({ message: 'User registered', userId: user._id });
  } catch (error) {
    console.error('Registration Error:', error); // Added detailed error logging
    res.status(500).json({ error: 'Registration failed', details: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    // Generate JWT Token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ message: 'Login success', token });
  } catch (error) {
    res.status(400).json({ error: 'Login failed', details: error.message });
  }
});

// new: Chat routes
app.get('/api/chats', authenticate, async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.user.userId }).sort({ updatedAt: -1 });
    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chats' });
  }
});

app.post('/api/chats', authenticate, async (req, res) => {
  try {
    const { title, messages } = req.body;
    // We are ignoring chatName or chatContent now for the single-save approach
    if (!title || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Missing title or messages array' });
    }

    const newChat = await Chat.create({
      userId: req.user.userId,
      title,
      messages
    });

    res.status(201).json(newChat);
  } catch (error) {
    console.error('Failed to create chat:', error);
    res.status(500).json({ error: 'Failed to create chat' });
  }
});

app.get('/api/chats/:id', authenticate, async (req, res) => {
  try {
    const chat = await Chat.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!chat) return res.status(404).json({ error: 'Chat not found' });
    res.json(chat);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get chat' });
  }
});

app.put('/api/chats/:id', authenticate, async (req, res) => {
  try {
    const chat = await Chat.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!chat) return res.status(404).json({ error: 'Chat not found' });

    chat.messages.push(req.body.message);
    await chat.save();

    res.json(chat);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update chat' });
  }
});

app.delete('/api/chats/:id', authenticate, async (req, res) => {
  try {
    const chat = await Chat.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!chat) return res.status(404).json({ error: 'Chat not found or already deleted' });
    res.json({ message: 'Chat deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete chat' });
  }
});

app.post('/api/users/chats', authenticate, async (req, res) => {
  try {
    const { chatName, chatContent } = req.body;
    if (!chatName || !chatContent) {
      return res.status(400).json({ error: 'Missing chatName or chatContent' });
    }

    const newChat = await ChatSaving.create({
      userId: req.user.userId,
      chatName: chatName,
      chatContent: chatContent
    });

    res.status(201).json(newChat);
  } catch (error) {
    console.error('Failed to save chat:', error);
    res.status(500).json({ error: 'Failed to save chat' });
  }
});

// Fallback for unknown endpoints
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: 'Server error', details: err.message });
});

export default app;