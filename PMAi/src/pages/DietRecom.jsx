import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FaUtensils, FaAppleAlt, FaCarrot, FaFish, FaBreadSlice } from "react-icons/fa";

function DietRecom() {
  const navigate = useNavigate();
  const [goal, setGoal] = useState("");
  const [customDietPlan, setCustomDietPlan] = useState([]);
  const [inputGoal, setInputGoal] = useState("");

  const handleSubmitGoal = () => {
    if (goal || inputGoal) {
      const selectedGoal = goal || inputGoal;
      setCustomDietPlan([{ meal: "Loading diet plan for " + selectedGoal + "..." }]);
    }
  };

  const getGoalIcon = (goal) => {
    switch (goal) {
      case "weightLoss":
        return <FaAppleAlt className="w-6 h-6 text-green-500" />;
      case "weightGain":
        return <FaBreadSlice className="w-6 h-6 text-yellow-500" />;
      case "diabetes":
        return <FaCarrot className="w-6 h-6 text-orange-500" />;
      case "muscleGain":
        return <FaFish className="w-6 h-6 text-blue-500" />;
      default:
        return <FaUtensils className="w-6 h-6 text-indigo-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-700/30 p-6">
          <h1 className="text-3xl font-bold text-white mb-6 text-center">
            Personalized Diet Plan
          </h1>

          {/* Ask user for their goal */}
          {!goal && customDietPlan.length === 0 ? (
            <div className="space-y-6">
              <p className="text-lg text-gray-300 text-center mb-4">
                What is your goal for the diet plan?
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { id: "weightLoss", label: "Weight Loss" },
                  { id: "weightGain", label: "Weight Gain" },
                  { id: "diabetes", label: "Diabetes Management" },
                  { id: "muscleGain", label: "Muscle Gain" },
                  { id: "healthyEating", label: "Healthy Eating" }
                ].map((option) => (
                  <Button
                    key={option.id}
                    onClick={() => setGoal(option.id)}
                    className="flex flex-col items-center justify-center gap-2 bg-gray-700/50 hover:bg-gray-700 text-white p-4 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    {getGoalIcon(option.id)}
                    <span className="text-sm">{option.label}</span>
                  </Button>
                ))}
              </div>
              <div className="mt-6">
                <Input
                  placeholder="Type your custom goal..."
                  value={inputGoal}
                  onChange={(e) => setInputGoal(e.target.value)}
                  className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent mb-4"
                />
                <Button
                  onClick={handleSubmitGoal}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  Submit Goal
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-center gap-3 mb-6">
                {getGoalIcon(goal)}
                <h2 className="text-2xl font-semibold text-white">
                  Your Personalized Diet Plan for {goal || inputGoal}
                </h2>
              </div>
              <div className="space-y-4">
                {customDietPlan.map((meal, idx) => (
                  <Card
                    key={idx}
                    className="bg-gray-700/30 border border-gray-600 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl"
                  >
                    <div className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center">
                          <FaUtensils className="w-4 h-4 text-white" />
                        </div>
                        <p className="text-gray-300 text-md leading-relaxed">
                          {meal.meal}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              <Button
                onClick={() => {
                  setGoal("");
                  setInputGoal("");
                  setCustomDietPlan([]);
                }}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Change Goal
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DietRecom;
