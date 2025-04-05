import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BrowserRouter as Router, useNavigate } from "react-router-dom";

function UserProfile(user) {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    age: "",
    weight: "",
    height: "",
    gender: "",
    bloodType: "",
    allergies: "",
    medicalConditions: "",
    photo: "",
  });

  const [isEditing, setIsEditing] = useState(true);
  const [formData, setFormData] = useState(userData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = () => {
    setUserData(formData);
    setIsEditing(false);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  useEffect(() => {
    // Optional: fetch user data here if needed
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-lg border border-gray-100 p-6 flex flex-col">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {isEditing ? "Create Your Profile" : "My Profile"}
        </h1>

        <div className="flex items-center gap-4 mb-6">
          <img
            src={userData.photo || "/path/to/default-photo.jpg"}
            alt="Profile"
            className="w-24 h-24 rounded-full border-2 border-indigo-500 shadow-md"
          />
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700">Name</label>
              <Input type="text" name="name" value={formData.name} onChange={handleInputChange} className="mt-2" />
            </div>
            <div>
              <label className="block text-gray-700">Email</label>
              <Input type="email" name="email" value={formData.email} onChange={handleInputChange} className="mt-2" />
            </div>
            <div>
              <label className="block text-gray-700">Age</label>
              <Input type="number" name="age" value={formData.age} onChange={handleInputChange} className="mt-2" />
            </div>
            <div>
              <label className="block text-gray-700">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700">Weight (kg)</label>
              <Input type="number" name="weight" value={formData.weight} onChange={handleInputChange} className="mt-2" />
            </div>
            <div>
              <label className="block text-gray-700">Height (cm)</label>
              <Input type="number" name="height" value={formData.height} onChange={handleInputChange} className="mt-2" />
            </div>
            <div>
              <label className="block text-gray-700">Blood Type</label>
              <Input type="text" name="bloodType" value={formData.bloodType} onChange={handleInputChange} className="mt-2" />
            </div>
            <div>
              <label className="block text-gray-700">Allergies</label>
              <Input type="text" name="allergies" value={formData.allergies} onChange={handleInputChange} className="mt-2" />
            </div>
            <div>
              <label className="block text-gray-700">Medical Conditions</label>
              <Input type="text" name="medicalConditions" value={formData.medicalConditions} onChange={handleInputChange} className="mt-2" />
            </div>
            <div className="mt-4 flex gap-4">
              <Button onClick={handleSave} className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700">
                Save Profile
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <h3 className="text-gray-700">Name: {userData.name}</h3>
              <h3 className="text-gray-700">Email: {userData.email}</h3>
              <h3 className="text-gray-700">Age: {userData.age} years</h3>
              <h3 className="text-gray-700">Gender: {userData.gender}</h3>
              <h3 className="text-gray-700">Weight: {userData.weight} kg</h3>
              <h3 className="text-gray-700">Height: {userData.height} cm</h3>
              <h3 className="text-gray-700">Blood Type: {userData.bloodType}</h3>
              <h3 className="text-gray-700">Allergies: {userData.allergies}</h3>
              <h3 className="text-gray-700">Medical Conditions: {userData.medicalConditions}</h3>
            </div>
            <Button onClick={handleEditToggle} className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700">
              Edit Profile
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfile
