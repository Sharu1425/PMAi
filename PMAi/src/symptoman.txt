import React, { useState } from "react";
import { BrowserRouter as Router, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function SymptomAnalyzerContent() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi there! 👋 Tell me what symptoms you're experiencing today." }
  ]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage = { from: "user", text: userInput };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setUserInput("");
    setLoading(true);

    const response = await new Promise((resolve) =>
      setTimeout(() => {
        if (userInput.toLowerCase().includes("fever")) {
          resolve({
            reply: "Can you tell me how high your temperature is and how long you’ve had the fever?"
          });
        } else {
          resolve({ reply: "Thanks! Let me gather more info to understand your symptoms better." });
        }
      }, 1200)
    );

    setMessages((prev) => [...prev, { from: "bot", text: response.reply }]);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-lg border border-gray-100 p-6 flex flex-col h-[80vh]">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Symptom Analyzer</h1>

        <div className="flex-1 overflow-y-auto mb-4 space-y-4 px-1">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`max-w-[75%] px-4 py-3 rounded-xl text-sm leading-relaxed shadow-md ${
                msg.from === "user"
                  ? "bg-blue-500 text-white self-end rounded-br-none"
                  : `bg-gray-800 text-white self-start rounded-bl-none`
              }`}
            >
              {msg.text}
            </div>
          ))}
          {loading && (
            <div className="bg-gray-300 text-gray-700 px-4 py-3 rounded-xl max-w-[75%] text-sm self-start shadow-md">
              Typing...
            </div>
          )}
        </div>

        <div className="flex gap-2 mt-auto">
          <Input
            type="text"
            placeholder="Describe a symptom..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <Button
            onClick={sendMessage}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700"
            disabled={loading}
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function SymptomAnalyzer() {
  return (
    <Router>
      <SymptomAnalyzerContent />
    </Router>
  );
}
