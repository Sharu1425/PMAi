import React, { useState, useRef, useEffect } from "react";
import { BrowserRouter as Router, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, Stethoscope, CalendarHeart, Brain, BellRing, UtensilsCrossed, ActivitySquare } from "lucide-react";
import { motion } from "framer-motion";
import { FaUser, FaSignOutAlt, FaChartLine, FaCalendarAlt, FaBell } from "react-icons/fa";

function DashboardContent({ user, setIsAuthenticated }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const cards = [
    {
      icon: <Stethoscope className="text-blue-500" size={32} />,
      label: "Symptom Diagnoser",
      value: "Check Symptoms",
      link: "/symptoms"
    },
    {
      icon: <UtensilsCrossed className="text-pink-500" size={32} />,
      label: "Diet Plan",
      value: "Overview",
      link: "/diet"
    },
    {
      icon: <BellRing className="text-yellow-500" size={32} />,
      label: "Medical Reminders",
      value: "Next: 6PM",
      link: "/reminders"
    },
    {
      icon: <ActivitySquare className="text-emerald-500" size={32} />,
      label: "Health Tracker",
      value: "Basic Stats",
      link: "/health-tracking"
    },
    {
      icon: <CalendarHeart className="text-green-500" size={32} />,
      label: "Appointments",
      value: "3 Upcoming",
      link: "/appointments"
    },
    {
      icon: <BarChart3 className="text-purple-500" size={32} />,
      label: "Health Score",
      value: "82",
      link: "/health-score"
    },
    {
      icon: <Brain className="text-orange-500" size={32} />,
      label: "AI Suggestions",
      value: "12 Tips",
      link: "/ai-suggestions"
    }
  ];

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      {/* Navbar */}
      <nav className="bg-slate-800/50 backdrop-blur-lg border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-blue-400">
                PMAi Dashboard
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full hover:bg-slate-700/50 transition-colors">
                <FaBell className="w-5 h-5 text-blue-400" />
              </button>
              <div className="flex items-center space-x-2">
                <FaUser className="w-5 h-5 text-blue-400" />
                <span className="text-blue-200">{user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors"
              >
                <FaSignOutAlt className="w-5 h-5 text-red-400" />
                <span className="text-red-400">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {/* Stats Cards */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="glass-card p-6 rounded-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200">Total Appointments</p>
                <h3 className="text-3xl font-bold text-white">12</h3>
              </div>
              <div className="p-3 rounded-full bg-blue-500/20">
                <FaCalendarAlt className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="glass-card p-6 rounded-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200">Health Score</p>
                <h3 className="text-3xl font-bold text-white">85%</h3>
              </div>
              <div className="p-3 rounded-full bg-green-500/20">
                <FaChartLine className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="glass-card p-6 rounded-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200">Upcoming Checkup</p>
                <h3 className="text-3xl font-bold text-white">3 days</h3>
              </div>
              <div className="p-3 rounded-full bg-purple-500/20">
                <FaCalendarAlt className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-8 glass-card p-6 rounded-xl"
        >
          <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50">
              <div className="flex items-center space-x-4">
                <div className="p-2 rounded-full bg-blue-500/20">
                  <FaCalendarAlt className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-white">Appointment with Dr. Smith</p>
                  <p className="text-blue-200 text-sm">2 days ago</p>
                </div>
              </div>
              <span className="text-green-400">Completed</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50">
              <div className="flex items-center space-x-4">
                <div className="p-2 rounded-full bg-purple-500/20">
                  <FaChartLine className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-white">Health Assessment</p>
                  <p className="text-blue-200 text-sm">1 week ago</p>
                </div>
              </div>
              <span className="text-yellow-400">In Progress</span>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

export default function Dashboard({ user, setIsAuthenticated }) {
  return (
    <Router>
      <DashboardContent user={user} setIsAuthenticated={setIsAuthenticated} />
    </Router>
  );
}
