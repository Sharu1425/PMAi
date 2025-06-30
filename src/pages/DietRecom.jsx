import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FaUtensils, FaAppleAlt, FaCarrot, FaFish, FaBreadSlice, FaRobot, FaUser, FaUserEdit, FaSun, FaMoon, FaCookie } from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";
import FloatingActionButton from "@/components/FloatingActionButton";

function DietRecom() {
  const navigate = useNavigate();
  const [goal, setGoal] = useState("");
  const [customDietPlan, setCustomDietPlan] = useState([]);
  const [inputGoal, setInputGoal] = useState("");
  const [chatMode, setChatMode] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [mealPlan, setMealPlan] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Fetch user profile on component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Set goal from user profile if available
  useEffect(() => {
    if (userProfile && userProfile.weightGoals && !goal) {
      setGoal(userProfile.weightGoals);
    }
  }, [userProfile]);

  // Parse meal plan from AI response
  useEffect(() => {
    if (messages.length > 0) {
      const lastBotMessage = [...messages].reverse().find(msg => msg.from === "bot");
      if (lastBotMessage) {
        parseMealPlan(lastBotMessage.text);
      }
    }
  }, [messages]);

  const parseMealPlan = (text) => {
    // If the text contains "Breakfast", "Lunch", "Dinner", or "Snacks", it's likely a meal plan
    const mealKeywords = ["breakfast", "lunch", "dinner", "snack"];
    const hasKeywords = mealKeywords.some(keyword => text.toLowerCase().includes(keyword));
    
    if (!hasKeywords) {
      setMealPlan(null);
      return;
    }
    
    // Extract meal plan sections
    const mealPlanData = {
      breakfast: extractMealItems(text, "breakfast"),
      lunch: extractMealItems(text, "lunch"),
      dinner: extractMealItems(text, "dinner"),
      snacks: extractMealItems(text, "snack")
    };
    
    // Only set if we found at least one meal
    if (mealPlanData.breakfast.length || mealPlanData.lunch.length || 
        mealPlanData.dinner.length || mealPlanData.snacks.length) {
      setMealPlan(mealPlanData);
    }
  };
  
  const extractMealItems = (text, mealType) => {
    // Case insensitive search for the meal type
    const regex = new RegExp(`${mealType}[^:]*:([\\s\\S]*?)(?=(breakfast|lunch|dinner|snack)[^:]*:|$)`, 'i');
    const match = text.match(regex);
    
    if (!match) return [];
    
    // Extract bullet points or lines from the matched content
    const content = match[1].trim();
    const items = content.split(/[•\-\*\n]/).map(item => item.trim()).filter(Boolean);
    
    return items;
  };

  const fetchUserProfile = async () => {
    setProfileLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        // Not logged in, skip profile fetch
        setProfileLoading(false);
        return;
      }

      const response = await axios.get("http://localhost:5001/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data) {
        setUserProfile(response.data);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      if (error.response && error.response.status === 401) {
        // Token expired, redirect to login
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    } finally {
      setProfileLoading(false);
    }
  };

  const handleSubmitGoal = () => {
    // Only proceed if we have a goal (preset or custom)
    if (goal || inputGoal) {
      const selectedGoal = goal || inputGoal;
      console.log("Submitting goal:", selectedGoal);
      
      // Set chat mode and hide the chat interface
      setChatMode(true);
      setShowChat(false);
      
      // Initialize the chat with a welcome message
      const welcomeMessage = userProfile && userProfile.name 
        ? `Hi ${userProfile.name}! I'm your personal nutrition assistant. I'll help you create a diet plan for your goal: ${selectedGoal}. What specific dietary preferences do you have?`
        : `Hi there! I'm your personal nutrition assistant. I'll help you create a diet plan for your goal: ${selectedGoal}. What specific dietary preferences or restrictions do you have?`;
      
      setMessages([
        { 
          from: "bot", 
          text: welcomeMessage
        }
      ]);

      // Default message to send immediately to get a meal plan
      const initialMessage = `Please generate a balanced meal plan for my diet goal: ${selectedGoal}.`;
      setUserInput(initialMessage);
      
      // Short delay to allow state updates to propagate
      setTimeout(() => {
        console.log("Auto-sending initial message:", initialMessage);
        // Pass the message directly instead of relying on the state
        sendMessageWithText(initialMessage);
      }, 100);
    } else {
      console.log("No goal selected, cannot generate plan");
    }
  };

  // New function to send a specific message
  const sendMessageWithText = async (text) => {
    if (!text.trim()) return;
    
    console.log("Sending specific message:", text);

    // Add user message to chat
    const userMessage = { from: "user", text: text };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setUserInput("");
    setLoading(true);
    setError(null);

    try {
      // Create a user profile object for the AI context
      const dietUserProfile = {
        age: userProfile?.age || "",
        gender: userProfile?.gender || "",
        healthConditions: userProfile?.medicalConditions || "",
        dietaryRestrictions: userProfile?.dietaryRestrictions || "",
        allergies: userProfile?.allergies || "",
        weightGoals: goal || inputGoal || userProfile?.weightGoals || "",
        activityLevel: userProfile?.activityLevel || "",
        weight: userProfile?.weight || "",
        height: userProfile?.height || ""
      };

      // Request a structured meal plan
      let enhancedMessage = text;
      if (!messages.some(msg => msg.from === "user") || 
          messages.length <= 2) {
        enhancedMessage = `${text}. Please provide a structured meal plan with breakfast, lunch, dinner, and snacks options. Consider my goal: ${goal || inputGoal}`;
      }
      
      console.log("Sending enhanced message to API:", enhancedMessage);

      // Call the diet recommendations API
      const response = await axios.post("http://localhost:5001/api/diet-recommendations", {
        message: enhancedMessage,
        conversationHistory: messages.map(msg => ({
          from: msg.from, 
          text: msg.text
        })),
        userProfile: dietUserProfile
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
      console.error("Error getting diet recommendations:", err);
      setError("Sorry, I couldn't process your request. Please try again.");
      
      // Add error message to chat
      setMessages((prev) => [
        ...prev, 
        { 
          from: "bot", 
          text: "I'm having trouble connecting to the nutrition database right now. Please try again in a moment.",
          isError: true
        }
      ]);
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    const currentInput = userInput.trim();
    sendMessageWithText(currentInput);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
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

  // Handle goal selection and auto-generate plan
  const handleGoalSelect = (selectedGoal) => {
    setGoal(selectedGoal);
    
    // Use setTimeout to ensure state is updated before submitting
    setTimeout(() => {
      console.log("Auto-generating plan for preset goal:", selectedGoal);
      handleSubmitGoal();
    }, 10);
  };

  // Handle custom goal input and generate plan
  const handleCustomGoalChange = (e) => {
    const customGoal = e.target.value;
    setInputGoal(customGoal);
    
    // Clear any previously selected preset goal
    if (customGoal) {
      setGoal("");
      
      // Set a timer to auto-submit after user stops typing
      clearTimeout(window.customGoalTimer);
      if (customGoal.trim().length > 3) {
        window.customGoalTimer = setTimeout(() => {
          console.log("Auto-generating plan for custom goal:", customGoal);
          handleSubmitGoal();
        }, 800); // Reduced delay to make it feel more immediate
      }
    }
  };

  // Handle custom goal input when Enter key is pressed - immediately submit
  const handleCustomGoalKeyDown = (e) => {
    if (e.key === "Enter" && inputGoal.trim()) {
      clearTimeout(window.customGoalTimer);
      console.log("Enter key pressed for custom goal:", inputGoal);
      handleSubmitGoal();
    }
  };

  // Example dietary preferences
  const examplePreferences = [
    "I'm vegetarian",
    "I'm allergic to nuts",
    "I need high-protein options",
    "I prefer low-carb meals"
  ];

  const handleExampleClick = (example) => {
    setUserInput(example);
    // Focus the input after setting the example
    inputRef.current?.focus();
  };

  const handleEditProfile = () => {
    navigate("/profile");
  };

  // Get profile information to display
  const profileInfo = userProfile ? [
    { label: "Age", value: userProfile.age, icon: "👤" },
    { label: "Weight", value: userProfile.weight ? `${userProfile.weight} kg` : null, icon: "⚖️" },
    { label: "Height", value: userProfile.height ? `${userProfile.height} cm` : null, icon: "📏" },
    { label: "Diet Restrictions", value: userProfile.dietaryRestrictions, icon: "🥗" },
    { label: "Allergies", value: userProfile.allergies, icon: "⚠️" },
    { label: "Medical Conditions", value: userProfile.medicalConditions, icon: "🏥" }
  ].filter(item => item.value) : [];

  // Render meal plan as a structured table
  const renderMealPlan = () => {
    if (!mealPlan) return null;
    
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/60 rounded-xl p-4 mb-6 shadow-lg"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <FaUtensils className="mr-2 text-indigo-400" /> Personalized Meal Plan
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Breakfast Section */}
          {mealPlan.breakfast.length > 0 && (
            <div className="bg-gray-700/40 rounded-xl p-3 backdrop-blur-sm">
              <h4 className="text-sm font-semibold text-yellow-300 mb-2 flex items-center">
                <FaSun className="mr-2" /> Breakfast
              </h4>
              <ul className="space-y-1">
                {mealPlan.breakfast.map((item, index) => (
                  <li key={`breakfast-${index}`} className="text-gray-300 text-sm flex items-start">
                    <div className="min-w-4 mt-1 mr-2">•</div>
                    <div>{item}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Lunch Section */}
          {mealPlan.lunch.length > 0 && (
            <div className="bg-gray-700/40 rounded-xl p-3 backdrop-blur-sm">
              <h4 className="text-sm font-semibold text-orange-300 mb-2 flex items-center">
                <FaUtensils className="mr-2" /> Lunch
              </h4>
              <ul className="space-y-1">
                {mealPlan.lunch.map((item, index) => (
                  <li key={`lunch-${index}`} className="text-gray-300 text-sm flex items-start">
                    <div className="min-w-4 mt-1 mr-2">•</div>
                    <div>{item}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Dinner Section */}
          {mealPlan.dinner.length > 0 && (
            <div className="bg-gray-700/40 rounded-xl p-3 backdrop-blur-sm">
              <h4 className="text-sm font-semibold text-blue-300 mb-2 flex items-center">
                <FaMoon className="mr-2" /> Dinner
              </h4>
              <ul className="space-y-1">
                {mealPlan.dinner.map((item, index) => (
                  <li key={`dinner-${index}`} className="text-gray-300 text-sm flex items-start">
                    <div className="min-w-4 mt-1 mr-2">•</div>
                    <div>{item}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Snacks Section */}
          {mealPlan.snacks.length > 0 && (
            <div className="bg-gray-700/40 rounded-xl p-3 backdrop-blur-sm">
              <h4 className="text-sm font-semibold text-purple-300 mb-2 flex items-center">
                <FaCookie className="mr-2" /> Snacks
              </h4>
              <ul className="space-y-1">
                {mealPlan.snacks.map((item, index) => (
                  <li key={`snack-${index}`} className="text-gray-300 text-sm flex items-start">
                    <div className="min-w-4 mt-1 mr-2">•</div>
                    <div>{item}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  const getGoalLabel = (goalId) => {
    const goalMap = {
      "weightLoss": "Weight Loss",
      "weightGain": "Weight Gain",
      "diabetes": "Diabetes Management",
      "muscleGain": "Muscle Gain",
      "healthyEating": "Healthy Eating"
    };
    
    return goalMap[goalId] || goalId;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-700/30 p-6">
          <h1 className="text-3xl font-bold text-white mb-6 text-center">
            Personalized Diet Plan
          </h1>

        {/* Ask user for their goal */}
        {!chatMode ? (
            <div className="space-y-6">
              {profileLoading ? (
                <div className="text-center py-10">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-500 border-r-transparent"></div>
                  <p className="mt-4 text-gray-300">Loading your profile...</p>
                </div>
              ) : (
                <>
                  {/* User profile information */}
                  {userProfile ? (
                    <div className="bg-gray-700/30 rounded-xl p-4 mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-white">Your Health Profile</h3>
                        <Button 
                          onClick={handleEditProfile}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3 py-1 rounded-lg flex items-center gap-1"
                        >
                          <FaUserEdit className="w-3 h-3" />
                          Edit
                        </Button>
                      </div>
                      
                      {profileInfo.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {profileInfo.map((item, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <span className="text-lg">{item.icon}</span>
                              <div>
                                <p className="text-xs text-gray-400">{item.label}</p>
                                <p className="text-sm text-gray-300">{item.value}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-2">
                          <p className="text-gray-400 text-sm mb-2">Your health profile is incomplete</p>
                          <Button 
                            onClick={handleEditProfile}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3 py-1 rounded-lg"
                          >
                            Complete Your Profile
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-gray-700/30 rounded-xl p-4 mb-6 text-center">
                      <p className="text-gray-300 mb-3">Create a profile to get personalized diet recommendations</p>
                      <Button 
                        onClick={handleEditProfile}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
                      >
                        Create Profile
                      </Button>
                    </div>
                  )}

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
                        onClick={() => handleGoalSelect(option.id)}
                        className={`flex flex-col items-center justify-center gap-2 ${goal === option.id ? "bg-indigo-600" : "bg-gray-700/50 hover:bg-gray-700"} text-white p-4 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5`}
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
                      onChange={handleCustomGoalChange}
                      onKeyDown={handleCustomGoalKeyDown}
                      className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent mb-4"
                    />
                    <Button
                      onClick={() => {
                        console.log("Generate button clicked with goal:", goal || inputGoal);
                        handleSubmitGoal();
                      }}
                      disabled={!goal && !inputGoal}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:bg-indigo-600 disabled:hover:translate-y-0"
                    >
                      Generate My Diet Plan
                    </Button>
                  </div>
                </>
              )}
            </div>
        ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-center gap-3 mb-6">
                {getGoalIcon(goal)}
                <h2 className="text-2xl font-semibold text-white">
                  Diet Plan: {getGoalLabel(goal) || inputGoal}
                </h2>
              </div>
              
              {/* User profile summary in chat mode */}
              {userProfile && profileInfo.length > 0 && (
                <div className="bg-gray-700/30 rounded-xl p-3 mb-3 flex flex-wrap justify-between text-xs">
                  {profileInfo.slice(0, 4).map((item, index) => (
                    <div key={index} className="flex items-center gap-1 px-2">
                      <span>{item.icon}</span>
                      <span className="text-gray-400">{item.label}:</span>
                      <span className="text-gray-300">{item.value}</span>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Meal Plan Table View */}
              {mealPlan ? (
                renderMealPlan()
              ) : (
                <div className="p-8 text-center">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-500 border-r-transparent"></div>
                  <p className="mt-4 text-gray-300">Generating your personalized meal plan...</p>
                </div>
              )}
              
              {/* Toggle Chat Button */}
              <div className="flex justify-center mt-4">
                <Button
                  onClick={() => setShowChat(!showChat)}
                  className="bg-gray-700/50 hover:bg-gray-600/70 text-white px-4 py-2 rounded-lg"
                >
                  {showChat ? "Hide Chat Interface" : "Show Chat Interface"}
                </Button>
              </div>
              
              {/* Chat interface - only shown when toggle is on */}
              {showChat && (
                <>
                  <div className="flex-1 overflow-y-auto mb-6 space-y-4 px-1 h-[40vh] overflow-auto bg-gray-900/30 rounded-xl p-4">
                    {messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex items-start gap-3 ${
                          msg.from === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        {msg.from === "bot" && (
                          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center">
                            <FaRobot className="w-4 h-4 text-white" />
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

                  {/* Example dietary preferences */}
                  {messages.length < 3 && (
                    <div className="mb-4">
                      <p className="text-gray-400 text-sm mb-2">Try sharing:</p>
                      <div className="flex flex-wrap gap-2">
                        {examplePreferences.map((example, index) => (
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
                      placeholder="Ask about recipes, meal plans, or nutrition advice..."
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
                </>
              )}
              
              {error && !loading && (
                <div className="mt-3 p-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-xs text-center">
                  {error}
                </div>
              )}

              <div className="flex gap-4 mt-6">
                {mealPlan && (
                  <Button
                    onClick={() => {
                      const variantMessage = `Please provide a different meal plan variant for my goal: ${goal || inputGoal}`;
                      setUserInput(variantMessage);
                      sendMessageWithText(variantMessage);
                    }}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-xl"
                    disabled={loading}
                  >
                    Generate Different Plan
                  </Button>
                )}
                
                <Button
                  onClick={() => {
                    setChatMode(false);
                    setGoal("");
                    setInputGoal("");
                    setMessages([]);
                    setMealPlan(null);
                    setCustomDietPlan([]);
                    setShowChat(false);
                  }}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-xl"
                >
                  Start Over
                </Button>
              </div>
            </div>
        )}
        </div>
      </div>
      <FloatingActionButton />
    </div>
  );
}

export default DietRecom;
