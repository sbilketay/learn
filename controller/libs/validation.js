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
    'number.base': 'Remeber Me cannot be an empty field and must be number',
    'any.required': `Remeber is required`
  }),
})

const registerSchema = Joi.object({
  username: Joi.string().trim().pattern(/^[a-zA-Z0-9]+$/).required().min(4).messages({
    'string.pattern.base': 'Cannot be used special characters in username',
    'string.empty': `Username cannot be an empty field`,
    'string.min': `Username should have a minimum length of {#limit}`,
    'any.required': `Username is required`
  }),
  email: Joi.string().pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).required().email().messages({
    'string.pattern.base': 'Email must be a valid email, cannot be used special characters',
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