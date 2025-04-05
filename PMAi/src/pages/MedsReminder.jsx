import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function MedicationRemindersContent() {
  const [medications, setMedications] = useState([]);

  const [newReminder, setNewReminder] = useState({
    medication: "",
    dosage: "",
    time: "",
    mealTime: "Before Breakfast",
  });

  const handleAddReminder = () => {
    if (!newReminder.medication || !newReminder.dosage || !newReminder.time) return;

    const newMedicationReminder = {
      id: medications.length + 1,
      medication: newReminder.medication,
      dosage: newReminder.dosage,
      time: newReminder.time,
      mealTime: newReminder.mealTime,
      done: false,
    };
    setMedications([...medications, newMedicationReminder]);
    setNewReminder({ medication: "", dosage: "", time: "", mealTime: "Before Breakfast" });
  };

  const handleMarkAsDone = (id) => {
    setMedications(
      medications.map((med) =>
        med.id === id ? { ...med, done: true } : med
      )
    );
  };

  const handleRemoveReminder = (id) => {
    setMedications(medications.filter((med) => med.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-lg border border-gray-100 p-6 flex flex-col">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Medication Reminders</h1>

        {/* Form to Add New Reminder */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-4">
            <Input
              type="text"
              placeholder="Medication Name"
              value={newReminder.medication}
              onChange={(e) => setNewReminder({ ...newReminder, medication: e.target.value })}
              className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            <Input
              type="text"
              placeholder="Dosage (e.g., 500mg)"
              value={newReminder.dosage}
              onChange={(e) => setNewReminder({ ...newReminder, dosage: e.target.value })}
              className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            <Input
              type="time"
              value={newReminder.time}
              onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
              className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
          <div className="flex gap-4 mt-2">
            <select
              value={newReminder.mealTime}
              onChange={(e) => setNewReminder({ ...newReminder, mealTime: e.target.value })}
              className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              <option value="Before Breakfast">Before Breakfast</option>
              <option value="After Breakfast">After Breakfast</option>
              <option value="Before Lunch">Before Lunch</option>
              <option value="After Lunch">After Lunch</option>
              <option value="Before Dinner">Before Dinner</option>
              <option value="After Dinner">After Dinner</option>
            </select>
            <Button
              onClick={handleAddReminder}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 w-full"
            >
              Add Reminder
            </Button>
          </div>
        </div>

        {/* List of Medication Reminders */}
        <div className="space-y-4">
          {medications.map((medication) => (
            <Card
              key={medication.id}
              className={`bg-white p-4 rounded-xl border ${medication.done ? "border-gray-300" : "border-blue-500"}`}
            >
              <CardContent className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">{medication.medication}</h2>
                  <p className="text-sm text-gray-500">{medication.dosage}</p>
                  <p className="text-sm text-gray-500">{medication.time} - {medication.mealTime}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleMarkAsDone(medication.id)}
                    disabled={medication.done}
                    className={`px-4 py-2 text-white rounded-xl ${medication.done ? "bg-gray-300" : "bg-green-500"}`}
                  >
                    {medication.done ? "Done" : "Mark as Done"}
                  </Button>
                  <Button
                    onClick={() => handleRemoveReminder(medication.id)}
                    className="px-4 py-2 text-white bg-red-500 rounded-xl hover:bg-red-600"
                  >
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function MedicationReminders() {
  return (
    <Router>
      <MedicationRemindersContent />
    </Router>
  );
}
