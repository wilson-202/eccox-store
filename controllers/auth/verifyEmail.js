const pool = require("../../config/database");
class ForEmail {
  async verifyEmail(req, res) {
    const token = req.params.token;
    console.log(token);
    if (!token || typeof token !== "string") {
      return res.status(400).send("missing token");
    }
    try {
      const result = await pool.query(`SELECT userid FROM  verification WHERE verficationtoken = $1 AND expiresat > NOW() LIMIT 1`, [token]);
      if (result.rows.length === 0) {
        return res.send("invalid or expired token.");
      }
      const { userid } = result.rows[0];
      await pool.query(`UPDATE users SET emailverified  = TRUE WHERE id = $1 `, [userid]);
      await pool.query(`DELETE FROM verification WHERE userid = $1`, [userid]);
      //  res.status(200).send("email verified you can login now");
      return res.redirect("/login-user");
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "something went wrong" });
    }
  }
}

module.exports = {
  verifyEmailFirst: new ForEmail(),
};
