const pool = require("../../config/database");
const bcrypt = require("bcrypt");
const { message } = require("../../schemas/userSchemas");

class ForLogin {
  async login(req, res) {
    try {
      const { email, password } = req.body;
      if ((!email, !password)) {
        return res.status(400).json({
          error: "Email amd Password are required..",
        });
      }

      const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
      if (result.rows.length === 0) {
        return res.status(401).json({ error: "Account not Found" });
      }
      const userData = result.rows[0];
      const passwordCheck = await bcrypt.compare(password, userData.password);
      if (!passwordCheck) {
        return res.status(401).json({
          error: "Incorrect Password",
        });
      }
      const verificationCheck = await pool.query(`SELECT userid FROM verification WHERE userid = $1`, [userData.id]);
      if (verificationCheck.rows.length > 0) {
        return res.status(403).json({ error: "Account not verified check your Email to login" });
      } else {
        res.status(200).send("welcome");
      }
    } catch (error) {
      const errMsg = error.message || error.messages;
      return res.status(500).json({
        error: "something went wrong",
      });
    }
  }
}
module.exports = {
  ForLoginFirst: new ForLogin(),
};
