const express = require("express");
const pool = require("../config/database");

const authRouther = express.Router();
const { usersignup, userslogin, emailInputResetPass, otpCode, newPassword } = require("../schemas/userSchemas");
const validateRequest = require("../middlewares/validateSchemas");
const { verifyEmailFirst } = require("../controllers/auth/verifyEmail");
const { ForLoginFirst } = require("../controllers/auth/login");
const { signupFirst } = require("../controllers/auth/signup");
const { resetPasswordFirst, otpVerificationFirst, ForCreateNewPassFirst, ForResendOtpFirst } = require("../controllers/auth/forgotPass");
// app.post('', validateRequest(usersignup), (req,res)=>{
authRouther.get("/login-user", (req, res) => {
  res.render("login");
});
authRouther.get("/forgot-password", (req, res) => {
  res.render("forgotpass");
});

authRouther.get("/verify-otp", async (req, res) => {
  const { email } = req.query;
  const result = await pool.query(`SELECT id FROM users WHERE email = $1`, [email]);
  if (result.rows.length === 0) {
    return res.redirect("/forgot-password");
  }
  const userData = result.rows[0];
  const verifyResult = await pool.query(`SELECT userid FROM verification WHERE userid =$1`, [userData.id]);
  if (verifyResult.rows.length > 0) {
    return res.redirect("/forgot-password");
  }
  return res.render("enterotp");
});

authRouther.get("/create-new-password", async (req, res) => {
  const { email, code } = req.query;
  const result = await pool.query(`SELECT id FROM users WHERE email = $1`, [email]);
  if (result.rows.length === 0) {
    return res.redirect("/forgot-password");
  }
  const userData = result.rows[0];
  console.log(code);
  // return console.log(userData.id)
  const otpResultNew = await pool.query(`SELECT * FROM passwordresets WHERE userid =$1 AND  otpcode = $2`, [userData.id, code]);
  if (otpResultNew.rows.length === 0) {
    console.log("htsgfuauykfgwufy");
    return res.redirect("/forgot-password");
  }

  //        return res.redirect(`/create-new-password?email=${email}&code=${code}`)

  // console.log(email, code)

  // if(false){
  //   //render error page
  // }
  res.render("createnewpass");
});

authRouther.post('/resend-code-post', ForResendOtpFirst.resendOtp)
authRouther.post("/create-new-password-post", validateRequest(newPassword), ForCreateNewPassFirst.CreateNewPass);
authRouther.post("/verify-otp-submit", validateRequest(otpCode), otpVerificationFirst.otpVerification);
authRouther.post("/login-post", validateRequest(userslogin), ForLoginFirst.login);
authRouther.get("/verify-email/:token", verifyEmailFirst.verifyEmail);
authRouther.post("/signup-post", validateRequest(usersignup), signupFirst.signUp);
authRouther.post("/reset-email-submit", validateRequest(emailInputResetPass), resetPasswordFirst.resetEmail);
module.exports = authRouther;
