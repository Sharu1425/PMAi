import React, { useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Stethoscope, BellRing, UtensilsCrossed, UserRound } from "lucide-react";
import Navbar from "@/components/Navbar";

function Dashboard() {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));
  
  useEffect(() => {
    console.log("User from localStorage:", user);
  }, []);

  // Function to check if a route is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  const cards = [
    {
      icon: <Stethoscope className="text-white" size={36} strokeWidth={2} />,
      label: "Symptom Analyzer",
      value: "Check Symptoms",
      link: "/symptoms",
      gradient: "from-blue-600 to-blue-800",
      description: "Analyze your symptoms and get health insights"
    },
    {
      icon: <UtensilsCrossed className="text-white" size={36} strokeWidth={2} />,
      label: "Diet Recommendations",
      value: "Meal Plans",
      link: "/diet",
      gradient: "from-pink-600 to-pink-800",
      description: "Get personalized diet and meal plans"
    },
    {
      icon: <BellRing className="text-white" size={36} strokeWidth={2} />,
      label: "Medical Reminders",
      value: "Manage Meds",
      link: "/reminders",
      gradient: "from-yellow-600 to-yellow-800",
      description: "Set reminders for your medications"
    },
    {
      icon: <UserRound className="text-white" size={36} strokeWidth={2} />,
      label: "User Profile",
      value: "View & Edit",
      link: "/profile",
      gradient: "from-emerald-600 to-emerald-800",
      description: "Manage your health profile information"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <Navbar isAuthenticated={true} user={user} />
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Personalized Healthcare</h1>
          <p className="text-gray-300 mt-2 text-lg">
            Welcome back, {user?.name || user?.username || user?.firstName || "User"}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-6">
          {cards.map((card, index) => (
            <Link 
              to={card.link}
              key={index}
            >
              <Card
                className={`cursor-pointer bg-gradient-to-br ${card.gradient} hover:shadow-2xl transition-all duration-300 rounded-2xl border-0 transform hover:scale-105 hover:brightness-110 ${isActive(card.link) ? 'ring-2 ring-white/50' : ''}`}
                role="button"
                aria-label={`Go to ${card.label}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-5">
                    <div className="bg-black/20 p-4 rounded-xl shadow-inner">
                      {card.icon}
                    </div>
                    <div>
                      <p className="text-sm text-white font-medium uppercase tracking-wide">{card.label}</p>
                      <p className="text-2xl font-bold text-white mt-1">{card.value}</p>
                    </div>
                  </div>
                  <p className="text-white/80 mt-4 text-sm">{card.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;