const joi = require("joi");
const usersignup = joi.object({
  firstName: joi.string().min(3).max(20).required().label("First Name"),
  lastName: joi.string().min(3).max(20).required().label("Last Name"),
  //   username: joi.string().min(3).max(10).required(),
  email: joi.string().email().required().label("Email"),
  password: joi.string().min(8).required().label("Password"),
});

const userslogin = joi.object({
  email: joi.string().min(3).required().label("Email"),
  password: joi.string().min(8).required().label("Password"),
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
