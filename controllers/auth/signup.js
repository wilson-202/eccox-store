const pool = require("../../config/database");
const bcrypt = require("bcrypt");
const { message } = require("../../schemas/userSchemas");
const { generateVerificationToken, hashToken } = require("../../utils/token");
// const { transporter, mailOptions } = require("../../config/email");
const { sendVerificationEmail } = require("../../config/email");

class ForSignUP {
  async signUp(req, res) {
    try {
      const { firstName, lastName, email, password } = req.body;
      const result = await pool.query(`SELECT email FROM users WHERE email = $1`, [email]);
      if (result.rows.length > 0) {
        // console.log(result);
        return res.status(409).json({ error: "email already exists " });
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      const userResult = await pool.query(`INSERT INTO users (firstName, lastName, email, password) VALUES($1,$2,$3,$4) RETURNING id, email`, [firstName, lastName, email, hashedPassword]);
      const user = userResult.rows[0];
      // console.log(user);

      const rawToken = generateVerificationToken();
      // const tokenHash = hashToken(rawToken);
      await pool.query(`INSERT INTO verification (userid, usersemail,  verficationtoken, expiresat ) VALUES($1, $2, $3, NOW() + INTERVAL '24 hours')`, [user.id, user.email, rawToken]);
      await sendVerificationEmail(user.email, rawToken);
      // return console.log(mailInfo);

      return res.status(201).json({
        message: "User registered successfully. Please check your email for verification.",
        userId: user.id,
      });
    } catch (error) {
      const errMsg = error.message || error.messages;
      return res.status(500).json({
        error: "something went wrong",
      });
    }
  }
}
module.exports = {
  signupFirst: new ForSignUP(),
};
