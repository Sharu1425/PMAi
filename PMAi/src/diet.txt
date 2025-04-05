import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

function DietPlanContent() {
  const navigate = useNavigate();

  const [goal, setGoal] = useState("");
  const [customDietPlan, setCustomDietPlan] = useState([]);
  const [inputGoal, setInputGoal] = useState("");

  // Handle submission and simulate API call
  const handleSubmitGoal = () => {
    if (goal || inputGoal) {
      const selectedGoal = goal || inputGoal;
      // Simulated API response (replace with actual API call)
      setCustomDietPlan([{ meal: "Loading diet plan for " + selectedGoal + "..." }]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-lg border border-gray-100 p-6 flex flex-col">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Diet Plan</h1>

        {/* Ask user for their goal */}
        {!goal && customDietPlan.length === 0 ? (
          <div className="space-y-4">
            <p className="text-lg mb-2">What is your goal for the diet plan?</p>
            <div className="flex flex-wrap gap-2">
              {[
                "weightLoss",
                "weightGain",
                "diabetes",
                "muscleGain",
                "healthyEating"
              ].map((option) => (
                <Button
                  key={option}
                  onClick={() => setGoal(option)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
                >
                  {option}
                </Button>
              ))}
            </div>
            <div className="mt-4">
              <Input
                placeholder="Type your custom goal..."
                value={inputGoal}
                onChange={(e) => setInputGoal(e.target.value)}
                className="mb-3"
              />
              <Button
                onClick={handleSubmitGoal}
                className="bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700"
              >
                Submit Goal
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              Your Personalized Diet Plan for {goal || inputGoal}
            </h2>
            {/* This content should be fetched from the API in real usage */}
            {customDietPlan.map((meal, idx) => (
              <Card key={idx} className="bg-white p-6 rounded-lg shadow-md mb-4">
                <div className="flex flex-col space-y-2">
                  <p className="text-gray-700 text-md leading-relaxed">
                    • {meal.meal}
                  </p>
                </div>
              </Card>
            ))}
            <Button
              onClick={() => {
                setGoal("");
                setInputGoal("");
                setCustomDietPlan([]);
              }}
              className="bg-gray-500 text-white px-6 py-3 rounded-xl hover:bg-gray-600 mt-4"
            >
              Change Goal
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DietPlan() {
  return (
    <Router>
      <DietPlanContent />
    </Router>
  );
}
