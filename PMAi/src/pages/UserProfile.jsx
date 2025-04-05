"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import * as faceapi from "@vladmandic/face-api";
import AnimatedBackground from "../components/AnimatedBackground";

function UserProfile({ user }) {
    const [testHistory, setTestHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isRegisteringFace, setIsRegisteringFace] = useState(false);
    const [faceRegistrationError, setFaceRegistrationError] = useState("");
    const [averageScore, setAverageScore] = useState(0);
    const [totalAttempts, setTotalAttempts] = useState(0);
    const videoRef = useRef();
    const [modelsLoaded, setModelsLoaded] = useState(false);

    useEffect(() => {
        if (user?._id) {
            fetchTestHistory();
            loadFaceModels();
        }
    }, [user?._id]);

    async function fetchTestHistory() {
        try {
            const response = await axios.get(`http://localhost:5001/db/users/${user._id}/results`, { 
                withCredentials: true 
            });
            setTestHistory(response.data.results);
            setAverageScore(response.data.averageScore);
            setTotalAttempts(response.data.totalAttempts);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching test history:", error);
            setError(error.response?.data?.error || "Failed to load test history");
            setLoading(false);
        }
    }

    async function loadFaceModels() {
        try {
            await Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
                faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
                faceapi.nets.faceLandmark68Net.loadFromUri("/models")
            ]);
            setModelsLoaded(true);
            startVideo();
        } catch (error) {
            console.error("Error loading face detection models:", error);
            setFaceRegistrationError("Failed to load face detection models");
        }
    }

    function startVideo() {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            })
            .catch((err) => {
                console.error("Camera access error:", err);
                setFaceRegistrationError("Failed to access camera");
            });
    }

    async function registerFace() {
        if (!modelsLoaded || isRegisteringFace) return;
        setIsRegisteringFace(true);
        setFaceRegistrationError("");

        try {
            const detections = await faceapi
                .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks()
                .withFaceDescriptor();

            if (!detections) {
                setFaceRegistrationError("No face detected. Please position your face in the camera.");
                setIsRegisteringFace(false);
                return;
            }

            const faceDescriptor = Array.from(detections.descriptor);
            
            const response = await axios.post("http://localhost:5001/auth/face/register", {
                faceDescriptor,
                userId: user._id
            }, { withCredentials: true });

            if (response.data.success) {
                alert("Face registered successfully!");
            } else {
                setFaceRegistrationError(response.data.error || "Failed to register face");
            }
        } catch (error) {
            console.error("Face registration error:", error);
            setFaceRegistrationError(error.response?.data?.error || "An error occurred during face registration");
        } finally {
            setIsRegisteringFace(false);
        }
    }

    return (
        <>
            <AnimatedBackground />
            <div className="container mx-auto px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-8 rounded-2xl neon-border shadow-xl backdrop-blur-xl border-1 relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10"></div>
                    
                    {/* Profile Header */}
                    <div className="relative mb-8">
                        <div className="flex items-center space-x-4">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-500/30 flex items-center justify-center">
                                {user?.profilePicture ? (
                                    <img 
                                        src={user.profilePicture} 
                                        alt="Profile" 
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                ) : (
                                    <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                )}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-purple-200">{user?.name}</h2>
                                <p className="text-purple-300">{user?.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Face Registration Section */}
                    <div className="relative mb-8">
                        <h3 className="text-xl font-semibold text-purple-200 mb-4">Face Recognition</h3>
                        <div className="flex flex-col items-center space-y-4">
                            <div className="relative">
                                <video 
                                    ref={videoRef} 
                                    autoPlay 
                                    className="rounded-lg w-[320px] h-[240px] object-cover"
                                />
                                <div className="absolute inset-0 border-2 border-purple-500/30 rounded-lg"></div>
                            </div>
                            <button
                                onClick={registerFace}
                                disabled={!modelsLoaded || isRegisteringFace}
                                className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                                    isRegisteringFace 
                                        ? "bg-purple-700/50 text-purple-300 cursor-not-allowed"
                                        : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
                                }`}
                            >
                                {isRegisteringFace ? "Registering..." : "Register Face"}
                            </button>
                            {faceRegistrationError && (
                                <p className="text-red-400 text-sm">{faceRegistrationError}</p>
                            )}
                        </div>
                    </div>

                    {/* Test History Section */}
                    <div className="relative">
                        <h3 className="text-xl font-semibold text-purple-200 mb-4">Test History</h3>
                        {loading ? (
                            <div className="text-purple-200">Loading test history...</div>
                        ) : error ? (
                            <div className="text-red-400">{error}</div>
                        ) : (
                            <>
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="p-4 rounded-lg bg-purple-900/20 border border-purple-500/30">
                                        <p className="text-purple-300">Total Attempts</p>
                                        <p className="text-2xl font-bold text-purple-200">{totalAttempts}</p>
                                    </div>
                                    <div className="p-4 rounded-lg bg-purple-900/20 border border-purple-500/30">
                                        <p className="text-purple-300">Average Score</p>
                                        <p className="text-2xl font-bold text-purple-200">
                                            {Math.round(averageScore * 100)}%
                                        </p>
                                    </div>
                                </div>
                                {testHistory.length === 0 ? (
                                    <div className="text-purple-200">No test attempts yet</div>
                                ) : (
                                    <div className="space-y-4">
                                        {testHistory.map((test, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="p-4 rounded-lg bg-purple-900/20 border border-purple-500/30"
                                            >
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <p className="text-purple-200">
                                                            Score: {test.score}/{test.totalQuestions}
                                                        </p>
                                                        <p className="text-purple-300 text-sm">
                                                            Date: {new Date(test.date).toLocaleDateString()}
                                                        </p>
                                                        <p className="text-purple-300 text-sm">
                                                            Topic: {test.topic} • Difficulty: {test.difficulty}
                                                        </p>
                                                    </div>
                                                    <div className="text-2xl font-bold text-purple-400">
                                                        {Math.round((test.score / test.totalQuestions) * 100)}%
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </motion.div>
            </div>
        </>
    );
}

export default UserProfile; 