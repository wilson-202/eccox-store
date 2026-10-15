const joi = require("joi");
// const usersignup = joi.object({
//   firstName: joi.string().min(3).max(20).required().label("First Name"),
//   lastName: joi.string().min(3).max(20).required().label("Last Name"),
//   //   username: joi.string().min(3).max(10).required(),
//   email: joi.string().email().required().label("Email"),
//   password: joi.string().min(8).required().label("Password"),
// });

const usersignup = joi.object({
  firstName: joi.string().min(3).max(20).required().messages({
    "string.empty": "First name is required.",
    "string.min": "First name must be at least 3 characters.",
    "string.max": "First name cannot exceed 20 characters.",
    "any.required": "First name is required.",
  }),

  lastName: joi.string().min(3).max(20).required().messages({
    "string.empty": "Last name is required.",
    "string.min": "Last name must be at least 3 characters.",
    "string.max": "Last name cannot exceed 20 characters.",
    "any.required": "Last name is required.",
  }),

  email: joi.string().email().required().messages({
    "string.empty": "Email address is required.",
    "string.email": "Please enter a valid email address.",
    "any.required": "Email address is required.",
  }),

  password: joi.string().min(8).required().messages({
    "string.empty": "Password is required.",
    "string.min": "Password must be at least 8 characters long.",
    "any.required": "Password is required.",
  }),
});

const userslogin = joi.object({
  // email: joi.string().min(3).required().label("Email"),
  // password: joi.string().min(8).required().label("Password"),

   email: joi.string().email().required().messages({
    "string.empty": "Email address is required.",
    "string.email": "Please enter a valid email address.",
    "any.required": "Email address is required.",
  }),

  password: joi.string().min(8).required().messages({
    "string.empty": "Password is required.",
    "string.min": "Password must be at least 8 characters long.",
    "any.required": "Password is required.",
  }),
});

const emailInputResetPass = joi.object({
  email: joi.string().email().required().label("Email"),
});

const otpCode = joi.object({
  code: joi.string().min(6).max(6).required().label("The Input Box"),
});

const newPassword = joi.object({
  password: joi.string().min(8).required().label("Password"),
  email: joi.string().email().required().messages({
    "any.required": "session expired, Please start over..",
    "string.empty": "session expired, Please start over..",
    "string.email": "session expired, Please start over..",
  }),
  code: joi.string().length(6).required().messages({
    "any.required": "session expired, Please start over..",
    "string.empty": "session expired, Please start over..",
    "string.length": "session expired, Please start over..",
  }),
});
module.exports = {
  usersignup,
  userslogin,
  emailInputResetPass,
  otpCode,
  newPassword,
};
