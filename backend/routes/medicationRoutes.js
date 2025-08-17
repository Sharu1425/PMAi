import express from "express"
import { auth } from "../middleware/auth.js"
import rateLimit from "express-rate-limit"

const router = express.Router()

// Rate limiting for medication endpoints
const medicationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 requests per windowMs
  message: {
    error: "Too many medication requests, please try again later.",
  },
})

// Get all medications for a user
router.get("/", auth, medicationLimiter, async (req, res) => {
  try {
    // TODO: Implement medication model and database operations
    // For now, return mock data that matches frontend expectations
    res.json({
      success: true,
      data: [
        {
          id: "1",
          name: "Vitamin D",
          dosage: "1000 IU",
          frequency: "Once daily",
          time: "08:00",
          startDate: "2024-01-01",
          endDate: "2024-12-31",
          instructions: "Take with breakfast",
          reminders: true,
          taken: false,
          category: "Vitamin",
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "2",
          name: "Omega-3",
          dosage: "500mg",
          frequency: "Twice daily",
          time: "08:00,20:00",
          startDate: "2024-01-01",
          endDate: "2024-06-30",
          instructions: "Take with meals",
          reminders: true,
          taken: true,
          category: "Supplement",
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ]
    })
  } catch (error) {
    console.error("Error fetching medications:", error)
    res.status(500).json({
      error: "Failed to fetch medications",
      message: "Internal server error",
    })
  }
})

// Add new medication
router.post("/", auth, medicationLimiter, async (req, res) => {
  try {
    const { 
      name, 
      dosage, 
      frequency, 
      time, 
      startDate, 
      endDate, 
      instructions, 
      reminders, 
      category 
    } = req.body
    
    if (!name || !dosage || !frequency || !time) {
      return res.status(400).json({
        error: "Missing required fields",
        message: "Name, dosage, frequency, and time are required",
      })
    }

    // TODO: Implement medication creation in database
    const newMedication = {
      id: Date.now().toString(),
      name,
      dosage,
      frequency,
      time,
      startDate: startDate || new Date().toISOString().split('T')[0],
      endDate: endDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      instructions: instructions || "",
      reminders: reminders !== undefined ? reminders : true,
      category: category || "General",
      taken: false,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    res.status(201).json({
      success: true,
      data: newMedication,
      message: "Medication added successfully",
    })
  } catch (error) {
    console.error("Error adding medication:", error)
    res.status(500).json({
      error: "Failed to add medication",
      message: "Internal server error",
    })
  }
})

// Update medication
router.put("/:id", auth, medicationLimiter, async (req, res) => {
  try {
    const { id } = req.params
    const updates = req.body

    if (!id) {
      return res.status(400).json({
        error: "Missing medication ID",
        message: "Medication ID is required",
      })
    }

    // TODO: Implement medication update in database
    const updatedMedication = {
      id,
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    res.json({
      success: true,
      data: updatedMedication,
      message: "Medication updated successfully",
    })
  } catch (error) {
    console.error("Error updating medication:", error)
    res.status(500).json({
      error: "Failed to update medication",
      message: "Internal server error",
    })
  }
})

// Delete medication
router.delete("/:id", auth, medicationLimiter, async (req, res) => {
  try {
    const { id } = req.params

    if (!id) {
      return res.status(400).json({
        error: "Missing medication ID",
        message: "Medication ID is required",
      })
    }

    // TODO: Implement medication deletion in database

    res.json({
      success: true,
      message: "Medication deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting medication:", error)
    res.status(500).json({
      error: "Failed to delete medication",
      message: "Internal server error",
    })
  }
})

// Mark medication as taken
router.patch("/:id/taken", auth, medicationLimiter, async (req, res) => {
  try {
    const { id } = req.params
    const { taken } = req.body

    if (!id) {
      return res.status(400).json({
        error: "Missing medication ID",
        message: "Medication ID is required",
      })
    }

    if (typeof taken !== "boolean") {
      return res.status(400).json({
        error: "Invalid taken value",
        message: "Taken must be a boolean value",
      })
    }

    // TODO: Implement medication taken status update in database
    // For now, return a mock updated medication
    const updatedMedication = {
      id,
      taken,
      updatedAt: new Date().toISOString(),
    }

    res.json({
      success: true,
      data: updatedMedication,
      message: `Medication marked as ${taken ? "taken" : "not taken"}`,
    })
  } catch (error) {
    console.error("Error updating medication taken status:", error)
    res.status(500).json({
      error: "Failed to update medication status",
      message: "Internal server error",
    })
  }
})

export default router
