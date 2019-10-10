const Joi = require('@hapi/joi')

const loginSchema = Joi.object({
  email: Joi.string().required().email().messages({
    'string.empty': `Email cannot be an empty field`,
    'string.min': `Email should have a minimum length of {#limit}`,
    'string.email': `Email must be a valid email`,
    'any.required': `Email is required`
  }),
  password: Joi.string().required().messages({
    'string.empty': `Password cannot be an empty field`,
    'any.required': `Password is required`
  }),
  rememberMe: Joi.number().required().messages({
    'number.base': 'Remeber Me is required and must be a number',
    'any.required': `Remeber is required`
  }),
})

const registerSchema = Joi.object({
  username: Joi.string().required().min(4).messages({
    'string.empty': `Username cannot be an empty field`,
    'string.min': `Username should have a minimum length of {#limit}`,
    'any.required': `Username is required`
  }),
  email: Joi.string().required().email().messages({
    'string.empty': `Email cannot be an empty field`,
    'string.min': `Email should have a minimum length of {#limit}`,
    'string.email': `Email must be a valid email`,
    'any.required': `Email is required`
  }),
  password: Joi.string().required().min(4).messages({
    'string.min': `Password should have a minimum length of {#limit}`,
    'string.empty': `Password cannot be an empty field`,
    'any.required': `Password is required`
  }),
})

module.exports = { loginSchema, registerSchema }