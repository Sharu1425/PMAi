import express from "express"
import { auth } from "../middleware/auth.js"
import rateLimit from "express-rate-limit"
import Medication from "../models/medication.js"

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
    const userId = req.user.id
    const medications = await Medication.find({ userId, isActive: true })
      .sort({ createdAt: -1 })
    
    res.json({
      success: true,
      data: medications
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
    const userId = req.user.id
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

    const newMedication = new Medication({
      userId,
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
    })

    await newMedication.save()

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
    const userId = req.user.id
    const updates = req.body

    if (!id) {
      return res.status(400).json({
        error: "Missing medication ID",
        message: "Medication ID is required",
      })
    }

    const updatedMedication = await Medication.findOneAndUpdate(
      { _id: id, userId },
      { ...updates, updatedAt: new Date() },
      { new: true }
    )

    if (!updatedMedication) {
      return res.status(404).json({
        error: "Medication not found",
        message: "Medication not found or you don't have permission to update it",
      })
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
    const userId = req.user.id

    if (!id) {
      return res.status(400).json({
        error: "Missing medication ID",
        message: "Medication ID is required",
      })
    }

    const deletedMedication = await Medication.findOneAndUpdate(
      { _id: id, userId },
      { isActive: false, updatedAt: new Date() },
      { new: true }
    )

    if (!deletedMedication) {
      return res.status(404).json({
        error: "Medication not found",
        message: "Medication not found or you don't have permission to delete it",
      })
    }

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
    const userId = req.user.id
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

    const updatedMedication = await Medication.findOneAndUpdate(
      { _id: id, userId },
      { taken, updatedAt: new Date() },
      { new: true }
    )

    if (!updatedMedication) {
      return res.status(404).json({
        error: "Medication not found",
        message: "Medication not found or you don't have permission to update it",
      })
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

// Get medication history
router.get("/history", auth, medicationLimiter, async (req, res) => {
  try {
    const userId = req.user.id
    const medications = await Medication.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20)
    
    res.json({
      success: true,
      data: medications
    })
  } catch (error) {
    console.error("Error fetching medication history:", error)
    res.status(500).json({
      error: "Failed to fetch medication history",
      message: "Internal server error",
    })
  }
})

export default router
