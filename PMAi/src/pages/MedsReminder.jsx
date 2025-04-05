import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FaPills, FaClock, FaTrash, FaCheck, FaBell } from "react-icons/fa";
import toast from "react-hot-toast";

function MedsReminder() {
  const [medications, setMedications] = useState(() => {
    // Load saved medications from localStorage
    const saved = localStorage.getItem("medications");
    return saved ? JSON.parse(saved) : [];
  });
  
  const [newReminder, setNewReminder] = useState({
    medication: "",
    dosage: "",
    time: "",
    mealTime: "Before Breakfast",
  });
  
  const [currentTime, setCurrentTime] = useState(new Date());

  // Save medications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("medications", JSON.stringify(medications));
  }, [medications]);
  
  // Update current time every second instead of every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // check every second
    
    return () => clearInterval(interval);
  }, []);
  
  // Check for medication reminders based on current time
  useEffect(() => {
    medications.forEach(med => {
      if (!med.done) {
        const now = new Date();
        const [medHours, medMinutes] = med.time.split(':').map(Number);
        
        const medTime = new Date();
        medTime.setHours(medHours, medMinutes, 0);
        
        // If the medication time is within the last 5 minutes and notification hasn't been sent
        const fiveMinutesAgo = new Date(now.getTime() - 5 * 60000);
        
        if (medTime >= fiveMinutesAgo && medTime <= now && !med.notified) {
          // Show notification
          toast.success(
            <div>
              <p className="font-bold">Medicine Reminder!</p>
              <p>It's time to take {med.medication} ({med.dosage})</p>
              <p className="text-sm">{med.mealTime}</p>
            </div>,
            {
              duration: 10000,
              icon: <FaBell className="text-yellow-400" />,
            }
          );
          
          // Update medication to mark as notified
          setMedications(
            medications.map((m) =>
              m.id === med.id ? { ...m, notified: true } : m
            )
          );
        }
      }
    });
  }, [currentTime, medications]);

  const handleAddReminder = () => {
    if (!newReminder.medication || !newReminder.dosage || !newReminder.time) return;

    const newMedicationReminder = {
      id: Date.now(),
      medication: newReminder.medication,
      dosage: newReminder.dosage,
      time: newReminder.time,
      mealTime: newReminder.mealTime,
      done: false,
      notified: false,
    };
    setMedications([...medications, newMedicationReminder]);
    setNewReminder({ medication: "", dosage: "", time: "", mealTime: "Before Breakfast" });
    
    toast.success("Medication reminder added!");
  };

  const handleMarkAsDone = (id) => {
    setMedications(
      medications.map((med) =>
        med.id === id ? { ...med, done: true } : med
      )
    );
    toast.success("Good job taking your medication!");
  };

  const handleRemoveReminder = (id) => {
    setMedications(medications.filter((med) => med.id !== id));
    toast.success("Reminder removed");
  };
  
  // Format time for display (12-hour format)
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-700/30 p-6">
          <h1 className="text-3xl font-bold text-white mb-6 text-center">
            Medication Reminders
          </h1>

          {/* Form to Add New Reminder */}
          <div className="mb-8 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                type="text"
                placeholder="Medication Name"
                value={newReminder.medication}
                onChange={(e) => setNewReminder({ ...newReminder, medication: e.target.value })}
                className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <Input
                type="text"
                placeholder="Dosage (e.g., 500mg)"
                value={newReminder.dosage}
                onChange={(e) => setNewReminder({ ...newReminder, dosage: e.target.value })}
                className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <Input
                type="time"
                value={newReminder.time}
                onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
                className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-4">
              <select
                value={newReminder.mealTime}
                onChange={(e) => setNewReminder({ ...newReminder, mealTime: e.target.value })}
                className="flex-1 bg-gray-700/50 border-gray-600 text-white rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="Before Breakfast">Before Breakfast</option>
                <option value="After Breakfast">After Breakfast</option>
                <option value="Before Lunch">Before Lunch</option>
                <option value="After Lunch">After Lunch</option>
                <option value="Before Dinner">Before Dinner</option>
                <option value="After Dinner">After Dinner</option>
                <option value="Bedtime">Bedtime</option>
                <option value="As Needed">As Needed</option>
              </select>
              <Button
                onClick={handleAddReminder}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Add Reminder
              </Button>
            </div>
          </div>

          {/* Current Time Display */}
          <div className="text-center mb-4">
            <p className="text-lg font-semibold text-white">Current Time: {currentTime.toLocaleTimeString()}</p>
          </div>

          {/* List of Medication Reminders */}
          <div className="space-y-4">
            {medications.length === 0 ? (
              <div className="text-center py-8">
                <FaPills className="text-gray-500 text-5xl mx-auto mb-3" />
                <p className="text-gray-400">No medication reminders yet.</p>
                <p className="text-gray-500 text-sm mt-2">Add your first reminder above.</p>
              </div>
            ) : (
              medications.map((medication) => (
                <Card
                  key={medication.id}
                  className={`bg-gray-700/30 border ${
                    medication.done ? "border-green-500/30" : 
                    (new Date().toTimeString().substring(0, 5) >= medication.time ? "border-red-500" : "border-indigo-500")
                  } rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl`}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full ${medication.done ? "bg-green-500" : "bg-indigo-500"} flex items-center justify-center`}>
                          <FaPills className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-white bg-gray-800/50 px-3 py-1 rounded-lg mb-1">{medication.medication}</h2>
                          <p className="text-sm text-white font-medium">{medication.dosage}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-300">
                            <FaClock className="w-3 h-3" />
                            <span>{formatTime(medication.time)} - {medication.mealTime}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {!medication.done && (
                          <Button
                            onClick={() => handleMarkAsDone(medication.id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg transition-all duration-300"
                          >
                            <FaCheck className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          onClick={() => handleRemoveReminder(medication.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg transition-all duration-300"
                        >
                          <FaTrash className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MedsReminder;
