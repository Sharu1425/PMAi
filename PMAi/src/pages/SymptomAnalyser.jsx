import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaRobot, FaUser, FaExclamationTriangle, FaHeartbeat } from "react-icons/fa";
import axios from "axios";

function SymptomAnalyser({ user }) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { 
      from: "bot", 
      text: "Hi there! I'm Dr. PMAi. How can I help you today? Tell me about any symptoms you're experiencing." 
    }
  ]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Focus input on component mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

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
        conversationHistory: messages.map(msg => ({
          from: msg.from, 
          text: msg.text
        }))
      });

      // Simulate typing delay for more natural conversation
      setTimeout(() => {
        // Add bot response to chat
        setMessages(prev => [...prev, { 
          from: "bot", 
          text: response.data.reply 
        }]);
        setLoading(false);
      }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds

    } catch (err) {
      console.error("Error analyzing symptoms:", err);
      setError("Sorry, I couldn't process your request. Please try again.");
      
      // Add error message to chat
      setMessages((prev) => [
        ...prev, 
        { 
          from: "bot", 
          text: "I'm having trouble accessing my medical database right now. This is just a hackathon demo, so there might be some technical issues. Could you please try asking me again?",
          isError: true
        }
      ]);
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Suggested symptom examples
  const exampleSymptoms = [
    "I've had a headache for two days",
    "My throat hurts and I have a fever",
    "I feel dizzy when I stand up",
    "My stomach has been hurting all day"
  ];

  const handleExampleClick = (example) => {
    setUserInput(example);
    // Focus the input after setting the example
    inputRef.current?.focus();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-700/30 p-6">
          <div className="flex items-center justify-center gap-3 mb-6">
            <FaHeartbeat className="w-8 h-8 text-indigo-400" />
            <h1 className="text-3xl font-bold text-white text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-blue-300">
              Virtual Doctor
            </h1>
          </div>
          
          <div className="flex-1 overflow-y-auto mb-6 space-y-4 px-1 h-[60vh] overflow-auto bg-gray-900/30 rounded-xl p-4">
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
                  className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-lg ${
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

          {/* Example symptoms */}
          {messages.length < 3 && (
            <div className="mb-4">
              <p className="text-gray-400 text-sm mb-2">Try asking about:</p>
              <div className="flex flex-wrap gap-2">
                {exampleSymptoms.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => handleExampleClick(example)}
                    className="bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 text-xs rounded-full px-3 py-1 transition-all"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Input
              ref={inputRef}
              type="text"
              placeholder="Describe your symptoms or ask a health question..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              disabled={loading}
            />
            <Button
              onClick={sendMessage}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg"
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