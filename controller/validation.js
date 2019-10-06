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

module.exports = { loginSchema }