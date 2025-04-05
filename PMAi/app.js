import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import axios from 'axios';
import Result from './models/result.js';
import User from './models/user.js';

dotenv.config();

console.log('Starting server...');
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
let prompt = "Generate 5 multiple-choice questions on Science with medium difficulty. Provide the questions in JSON format with the following structure: [{\"question\": \"\", \"options\": [\"\", \"\", \"\", \"\"], \"correctAnswer\": \"\"}]";
const app = express();
const port = 3001;
let Topic = "Science";
let QnCount = 5;
let Difficulty = "Easy";

app.use(cors());
app.use(express.json());

app.post('/api/topic', (req, res) => {
    const { topic, qnCount, difficulty } = req.body;
    if (!topic || !qnCount) {
        return res.status(400).json({ error: 'Invalid data' });
    }
    Topic = topic;
    QnCount = qnCount;
    Difficulty = difficulty;
    res.json({ topic, qnCount, difficulty });
});

async function fetchQuestionsFromGemini() {
    console.log('Fetching questions from Gemini API...');
    console.log('Using API Key:', GEMINI_API_KEY);
    prompt = `Generate ${QnCount} multiple-choice questions on ${Topic} with ${Difficulty} difficulty. Provide the questions in JSON format with the following structure: [{\"question\": \"\", \"options\": [\"\", \"\", \"\", \"\"], \"correctAnswer\": \"\"}]`;
    try {
        console.log('Prompt:', prompt);
        const result = await model.generateContent(prompt);
        const questions = JSON.parse(result.response.text().replace(/```json|```/g, ''));
        return questions;
    } catch (error) {
        console.error('Error parsing questions from Gemini:', error);
        throw new Error('Failed to parse questions from Gemini API');
    }
}

app.get('/api/questions', async (req, res) => {
    try {
        const questions = await fetchQuestionsFromGemini();
        console.log(questions);
        console.log('Sending Questions to DB');
        await axios.post("http://localhost:5001/db/questions", { Topic, Difficulty, questions })
        .then(response => {
            console.log(response.data.message);
        })
        .catch(error => {
            console.error(error.response.data.error);
        });
        console.log('Questions sent to DB');
        res.json(questions);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});