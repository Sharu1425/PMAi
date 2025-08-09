import Joi from "joi"

const validateRegistration = (req, res, next) => {
  console.log("🔍 Validation middleware - received data:", req.body)
  
  const schema = Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),
    username: Joi.string().trim().min(3).max(30).alphanum().optional(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(128).required(),
  })

  const { error } = schema.validate(req.body)

  if (error) {
    console.log("❌ Validation failed:", error.details[0].message)
    return res.status(400).json({
      error: "Validation Error",
      message: error.details[0].message,
    })
  }

  console.log("✅ Validation passed")
  next()
}

const validateLogin = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  })

  const { error } = schema.validate(req.body)

  if (error) {
    return res.status(400).json({
      error: "Validation Error",
      message: error.details[0].message,
    })
  }

  next()
}

const validateProfileUpdate = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().trim().min(2).max(100),
    healthProfile: Joi.object({
      age: Joi.number().min(0).max(150),
      gender: Joi.string().valid("male", "female", "other"),
      height: Joi.number().min(0),
      weight: Joi.number().min(0),
      bloodType: Joi.string().valid("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"),
      allergies: Joi.array().items(Joi.string()),
      medications: Joi.array().items(Joi.string()),
      medicalConditions: Joi.array().items(Joi.string()),
    }),
    preferences: Joi.object({
      notifications: Joi.object({
        email: Joi.boolean(),
        push: Joi.boolean(),
        sms: Joi.boolean(),
      }),
      privacy: Joi.object({
        shareData: Joi.boolean(),
        publicProfile: Joi.boolean(),
      }),
    }),
  })

  const { error } = schema.validate(req.body)

  if (error) {
    return res.status(400).json({
      error: "Validation Error",
      message: error.details[0].message,
    })
  }

  next()
}

export {
  validateRegistration,
  validateLogin,
  validateProfileUpdate,
}
