import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FaCamera, FaEdit, FaUpload } from "react-icons/fa";

function UserProfile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

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
    dietaryRestrictions: "",
    weightGoals: "",
    activityLevel: "",
    profilePicture: "",
  });

  const [isEditing, setIsEditing] = useState(true);
  const [formData, setFormData] = useState(userData);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch user profile data when component mounts
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get("http://localhost:5001/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data) {
        setUserData(response.data);
        setFormData(response.data);
        setImagePreview(response.data.profilePicture);
        setIsEditing(Object.keys(response.data).length < 5); // If minimal data, go to edit mode
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      if (error.response && error.response.status === 401) {
        // Unauthorized - token expired or invalid
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      
      // Call API to update user profile
      const response = await axios.put(
        "http://localhost:5001/users/profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setUserData(response.data.user);
        setIsEditing(false);
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    // Reset form data to current user data when editing
    if (!isEditing) {
      setFormData(userData);
      setImagePreview(userData.profilePicture);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // File type validation
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please select an image file (JPEG, PNG, GIF, WEBP)');
      return;
    }

    // File size validation (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload image
    handleImageUpload(file);
  };

  const handleImageUpload = async (file) => {
    setUploadingImage(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append('profileImage', file);

      const response = await axios.post(
        "http://localhost:5001/users/upload-profile-image",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        // Update both formData and userData with the new image URL
        const imageUrl = response.data.imageUrl;
        setFormData(prev => ({
          ...prev,
          profilePicture: imageUrl
        }));
        
        // Also update the userData state to persist the change
        setUserData(prev => ({
          ...prev,
          profilePicture: imageUrl
        }));
        
        // Update the local storage user data
        const localUser = JSON.parse(localStorage.getItem("user") || "{}");
        if (localUser) {
          localUser.profilePicture = imageUrl;
          localStorage.setItem("user", JSON.stringify(localUser));
        }
        
        toast.success("Profile picture updated successfully!");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to update profile picture");
      // Revert to previous image on error
      setImagePreview(userData.profilePicture);
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-gray-800/50 backdrop-blur-lg rounded-3xl shadow-lg border border-gray-700/30 p-6 flex flex-col">
        <h1 className="text-3xl font-bold text-white mb-4">
          {isEditing ? "Update Your Profile" : "My Profile"}
        </h1>

        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-2 border-indigo-500 shadow-md overflow-hidden bg-gray-700 flex items-center justify-center">
              {imagePreview ? (
                <img 
                  src={imagePreview} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl text-gray-400">
                  {userData.name ? userData.name.charAt(0).toUpperCase() : "U"}
                </span>
              )}
              
              {uploadingImage && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            
            {isEditing && (
              <button 
                onClick={triggerFileInput}
                className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full shadow-lg hover:bg-indigo-700 transition-all"
                disabled={uploadingImage}
              >
                <FaCamera size={14} />
              </button>
            )}
            
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*"
              onChange={handleImageChange}
              className="hidden" 
            />
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-white">{userData.name || userData.username}</h2>
            <p className="text-gray-400">{userData.email}</p>
            {isEditing && (
              <p className="text-xs text-indigo-300 mt-1 flex items-center gap-1">
                <FaEdit size={10} />
                Click the camera icon to update profile picture
              </p>
            )}
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Full Name</label>
                <Input 
                  type="text" 
                  name="name" 
                  value={formData.name || ""} 
                  onChange={handleInputChange} 
                  className="bg-gray-700/50 border-gray-600 text-white" 
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Age</label>
                <Input 
                  type="number" 
                  name="age" 
                  value={formData.age || ""} 
                  onChange={handleInputChange} 
                  className="bg-gray-700/50 border-gray-600 text-white" 
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Gender</label>
                <select
                  name="gender"
                  value={formData.gender || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Weight (kg)</label>
                <Input 
                  type="number" 
                  name="weight" 
                  value={formData.weight || ""} 
                  onChange={handleInputChange} 
                  className="bg-gray-700/50 border-gray-600 text-white" 
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Height (cm)</label>
                <Input 
                  type="number" 
                  name="height" 
                  value={formData.height || ""} 
                  onChange={handleInputChange} 
                  className="bg-gray-700/50 border-gray-600 text-white" 
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Blood Type</label>
                <select
                  name="bloodType"
                  value={formData.bloodType || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select Blood Type</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-300 mb-1">Allergies</label>
              <Input 
                type="text" 
                name="allergies" 
                value={formData.allergies || ""} 
                onChange={handleInputChange} 
                placeholder="e.g., peanuts, shellfish, dairy"
                className="bg-gray-700/50 border-gray-600 text-white" 
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-300 mb-1">Dietary Restrictions</label>
              <Input 
                type="text" 
                name="dietaryRestrictions" 
                value={formData.dietaryRestrictions || ""} 
                onChange={handleInputChange} 
                placeholder="e.g., vegetarian, vegan, gluten-free"
                className="bg-gray-700/50 border-gray-600 text-white" 
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-300 mb-1">Medical Conditions</label>
              <Input 
                type="text" 
                name="medicalConditions" 
                value={formData.medicalConditions || ""} 
                onChange={handleInputChange} 
                placeholder="e.g., diabetes, hypertension"
                className="bg-gray-700/50 border-gray-600 text-white" 
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-300 mb-1">Weight Goals</label>
              <select
                name="weightGoals"
                value={formData.weightGoals || ""}
                onChange={handleInputChange}
                className="w-full p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Goal</option>
                <option value="weightLoss">Weight Loss</option>
                <option value="weightGain">Weight Gain</option>
                <option value="maintenance">Maintain Weight</option>
                <option value="muscleGain">Muscle Gain</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-gray-300 mb-1">Activity Level</label>
              <select
                name="activityLevel"
                value={formData.activityLevel || ""}
                onChange={handleInputChange}
                className="w-full p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Activity Level</option>
                <option value="sedentary">Sedentary (little or no exercise)</option>
                <option value="light">Lightly active (light exercise 1-3 days/week)</option>
                <option value="moderate">Moderately active (moderate exercise 3-5 days/week)</option>
                <option value="active">Very active (hard exercise 6-7 days/week)</option>
                <option value="extraActive">Extra active (very hard exercise & physical job)</option>
              </select>
            </div>
            
            <div className="mt-4 flex gap-4">
              <Button 
                onClick={handleSave} 
                disabled={isLoading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                {isLoading ? "Saving..." : "Save Profile"}
              </Button>
              
              {userData.name && (
                <Button 
                  onClick={handleEditToggle} 
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-700/30 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-white mb-2">Personal</h3>
                <p className="text-gray-300"><span className="text-gray-500">Age:</span> {userData.age} years</p>
                <p className="text-gray-300"><span className="text-gray-500">Gender:</span> {userData.gender}</p>
                <p className="text-gray-300"><span className="text-gray-500">Weight:</span> {userData.weight} kg</p>
                <p className="text-gray-300"><span className="text-gray-500">Height:</span> {userData.height} cm</p>
                <p className="text-gray-300"><span className="text-gray-500">Blood Type:</span> {userData.bloodType}</p>
              </div>
              
              <div className="bg-gray-700/30 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-white mb-2">Health Information</h3>
                <p className="text-gray-300"><span className="text-gray-500">Allergies:</span> {userData.allergies || "None"}</p>
                <p className="text-gray-300"><span className="text-gray-500">Medical Conditions:</span> {userData.medicalConditions || "None"}</p>
                <p className="text-gray-300"><span className="text-gray-500">Dietary Restrictions:</span> {userData.dietaryRestrictions || "None"}</p>
              </div>
              
              <div className="bg-gray-700/30 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-white mb-2">Fitness</h3>
                <p className="text-gray-300"><span className="text-gray-500">Weight Goals:</span> {userData.weightGoals || "Not specified"}</p>
                <p className="text-gray-300"><span className="text-gray-500">Activity Level:</span> {userData.activityLevel || "Not specified"}</p>
              </div>
            </div>
            
            <Button 
              onClick={handleEditToggle} 
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Edit Profile
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfile;
