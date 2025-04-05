import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, Stethoscope, BellRing, UtensilsCrossed, ActivitySquare } from "lucide-react";
import Navbar from "@/components/Navbar";

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const cards = [
    {
      icon: <Stethoscope className="text-blue-500" size={32} />,
      label: "Symptom Diagnoser",
      value: "Check Symptoms",
      link: "/symptoms",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      icon: <UtensilsCrossed className="text-pink-500" size={32} />,
      label: "Diet Plan",
      value: "Overview",
      link: "/diet",
      gradient: "from-pink-500 to-pink-600"
    },
    {
      icon: <BellRing className="text-yellow-500" size={32} />,
      label: "Medical Reminders",
      value: "Next: 6PM",
      link: "/reminders",
      gradient: "from-yellow-500 to-yellow-600"
    },
    {
      icon: <ActivitySquare className="text-emerald-500" size={32} />,
      label: "Health Tracker",
      value: "Basic Stats",
      link: "/health-tracking",
      gradient: "from-emerald-500 to-emerald-600"
    },
    {
      icon: <BarChart3 className="text-purple-500" size={32} />,
      label: "Health Score",
      value: "82",
      link: "/health-score",
      gradient: "from-purple-500 to-purple-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <Navbar isAuthenticated={true} user={user} />
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Personalized Healthcare</h1>
          <p className="text-gray-400 mt-2">Your health companion</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <Card
              key={index}
              onClick={() => navigate(card.link)}
              className={`cursor-pointer bg-gradient-to-br ${card.gradient} hover:shadow-2xl transition-all duration-300 rounded-2xl border-0 transform hover:scale-105`}
            >
              <CardContent className="p-6 flex items-center gap-5">
                <div className="bg-white/10 p-3 rounded-xl">
                  {card.icon}
                </div>
                <div>
                  <p className="text-sm text-white/80 font-medium uppercase tracking-wide">{card.label}</p>
                  <p className="text-xl font-bold text-white mt-1">{card.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;