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
let prompt = "Provide the questions in JSON format with the following structure: [{\"question\": \"\", \"options\": [\"\", \"\", \"\", \"\"], \"correctAnswer\": \"\"}]";
const app = express();
const port = 3001;
let Topic = "Science";
let QnCount = 5;
let Difficulty = "Easy";

app.use(cors());
app.use(express.json());


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});