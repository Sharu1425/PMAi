import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaRobot, FaUser, FaExclamationTriangle } from "react-icons/fa";
import axios from "axios";

function SymptomAnalyser({ user }) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi there! 👋 Tell me what symptoms you're experiencing today." }
  ]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    // Add user message to chat
    const userMessage = { from: "user", text: userInput };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setUserInput("");
    setLoading(true);
    setError(null);

    try {
      // Call the symptom analysis API through our proxy endpoint
      const response = await axios.post("http://localhost:5001/api/symptom-analysis", {
        message: userInput,
        conversationHistory: messages
      });

      // Add bot response to chat
      setMessages((prev) => [...prev, { from: "bot", text: response.data.reply }]);
    } catch (err) {
      console.error("Error analyzing symptoms:", err);
      setError("Sorry, I couldn't process your request. Please try again.");
      
      // Add error message to chat
      setMessages((prev) => [
        ...prev, 
        { 
          from: "bot", 
          text: "I'm having trouble connecting to my knowledge base. Please try again or check back later.",
          isError: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-700/30 p-6">
          <h1 className="text-3xl font-bold text-white mb-6 text-center">
            Symptom Analyzer
          </h1>

          <div className="flex-1 overflow-y-auto mb-6 space-y-4 px-1 h-[60vh] overflow-auto">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-3 ${
                  msg.from === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.from === "bot" && (
                  <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center">
                    {msg.isError ? (
                      <FaExclamationTriangle className="w-4 h-4 text-white" />
                    ) : (
                      <FaRobot className="w-4 h-4 text-white" />
                    )}
                  </div>
                )}
                <div
                  className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-lg ${
                    msg.from === "user"
                      ? "bg-indigo-600 text-white rounded-br-none"
                      : msg.isError
                      ? "bg-red-700/70 text-white rounded-bl-none"
                      : "bg-gray-700 text-white rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
                {msg.from === "user" && (
                  <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center">
                    <FaUser className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center">
                  <FaRobot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-gray-700 text-white px-4 py-3 rounded-2xl rounded-bl-none">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex gap-3">
            <Input
              type="text"
              placeholder="Describe your symptoms..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              disabled={loading}
            />
            <Button
              onClick={sendMessage}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5"
              disabled={loading || !userInput.trim()}
            >
              Send
            </Button>
          </div>
          
          {error && !loading && (
            <div className="mt-3 p-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-xs text-center">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SymptomAnalyser; 