const pool = require("../../config/database");
const bcrypt = require("bcrypt");
const { message } = require("../../schemas/userSchemas");
const { generateOTP } = require("../../utils/token");
const { sendOTP } = require("../../config/email");
const { json } = require("express");

class ForReset {
  async resetEmail(req, res) {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({
          error: "Email is required",
        });
      }
      const result = await pool.query(`SELECT id FROM users WHERE email = $1`, [email]);
      if (result.rows.length === 0) {
        return res.status(401).json({
          error: "Account not Found",
        });
      }
      const userData = result.rows[0];
      const verificationCheck = await pool.query(`SELECT * FROM  verification WHERE userid = $1`, [userData.id]);
      if (verificationCheck.rows.length > 0) {
        return res.status(403).json({ error: "Email has not been verified, verify Email first" });
      } else {
        const code = generateOTP();
        console.log(code);
        const checkForExisting = await pool.query(`SELECT userid FROM passwordresets WHERE userid = $1`, [userData.id]);
        if (checkForExisting.rows.length > 0) {
          await pool.query(`UPDATE passwordresets SET otpcode = $1, expiresat = NOW() + INTERVAL '10 minutes'  WHERE userid = $2 `, [code, userData.id]);

          // res.status(200).json({
          //   message: "A 6-digit code was sent again to the email you provided",
          // });
        } else {
          await pool.query(`INSERT INTO passwordresets (userid,  otpcode, expiresat) VALUES($1, $2, NOW() + INTERVAL '10 minutes')`, [userData.id, code]);
          // res.status(200).json({
          //   message: "A 6-digit code was sent to the email you provided",
          // });
        }

        await sendOTP(email, code);
        return res.status(200).json({
          message: "A 6-digit code was sent again to the email you provided",
        });
      }
    } catch (error) {
      const errMsg = error.message || error.messages;
      console.log(errMsg);
      return res.status(500).json({
        error: "something went wrong",
      });
    }
  }
}

class ForOtpVerification {
  async otpVerification(req, res) {
    try {
      const { code } = req.body;
      const otpResult = await pool.query(`SELECT userid FROM passwordresets WHERE otpcode = $1 AND expiresat > NOW()`, [code]);
      if (otpResult.rows.length === 0) {
        return res.status(422).json({
          error: "Invalid or Expired code",
        });
      } else {
        return res.status(200).json({ message: "success" });
      }
    } catch (error) {
      const errMsg = error.message || error.messages;
      console.log(errMsg);
      return res.status(500).json({
        error: "something went wrong",
      });
    }
  }
}

class ForCreateNewPass {
  async CreateNewPass(req, res) {
    try {
      const { email, code, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "Session expired, Please start the reset again", redirctTo: "/forgot-password" });
      }

      console.log(code);

      const result = await pool.query(`SELECT id FROM users WHERE email = $1`, [email]);
      if (result.rows.length === 0) {
        return res.status(400).json({ error: "Invalid Request" });
      }
      const userData = result.rows[0];
      console.log(code);
      // return console.log(userData.id)
      const otpResultNew = await pool.query(`SELECT * FROM passwordresets WHERE userid =$1 AND  otpcode = $2 AND expiresat > NOW()`, [userData.id, code]);
      if (otpResultNew.rows.length === 0) {
        console.log("htsgfuauykfgwufy");
        return res.status(400).json({
          error: "Ivalid or Expired code",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      await pool.query(`UPDATE users SET password = $1 WHERE id = $2`, [hashedPassword, userData.id]);
      await pool.query(`DELETE FROM passwordresets WHERE userid = $1`, [userData.id]);
      console.log("succccccc");
      return res.status(200).json({
        message: "Password Reset was a success",
      });
    } catch (error) {
      const errMsg = error.message || error.messages;
      console.log(errMsg);
      return res.status(500).json({
        error: "something went wrong",
      });
    }
  }
}

class ForResendOtp {
  async resendOtp(req, res) {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({
          error: "Session Expired, Please start the reset again",
        });
      }

      const result = await pool.query(`SELECT id FROM users WHERE email = $1`, [email]);
      if (result.rows.length === 0) {
        return res.status(401).json({
          error: "Account not Found",
        });
      }

      const userData = result.rows[0];
      const verificationCheck = await pool.query(`SELECT * FROM  verification WHERE userid = $1`, [userData.id]);
      if (verificationCheck.rows.length > 0) {
        return res.status(403).json({ error: "Email has not been verified, verify Email first" });
      } else {
        const code = generateOTP();
        console.log(code);
        const checkForExisting = await pool.query(`SELECT userid FROM passwordresets WHERE userid = $1`, [userData.id]);
        if (checkForExisting.rows.length > 0) {
          await pool.query(`UPDATE passwordresets SET otpcode = $1, expiresat = NOW() + INTERVAL '10 minutes'  WHERE userid = $2 `, [code, userData.id]);

          res.status(200).json({
            message: "A 6-digit code was sent again to the email you provided",
          });
        }

        return await sendOTP(email, code);
      }
    } catch (error) {}
  }
}

module.exports = {
  resetPasswordFirst: new ForReset(),
  otpVerificationFirst: new ForOtpVerification(),
  ForCreateNewPassFirst: new ForCreateNewPass(),
  ForResendOtpFirst: new ForResendOtp(),
};
