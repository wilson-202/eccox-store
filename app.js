require("dotenv").config();
const express = require("express");
const path = require("path");
const multer = require("multer");
const { type } = require("os");
const app = express();
const session = require("express-session");
app.use(express.static("src"));
app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const pool = require("./config/database");

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.ENVIRONMENT === "development" ? false : true,
      httpOnly: true,
      maxAge: 1000 * 60 * 60,
    },
  }),
);

const indexRouther = require("./routers/index");
app.use(indexRouther);

const fs = require("fs");
const { message } = require("./schemas/userSchemas");
if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); //folder to store uploaded files
  },
  filename: (req, file, cb) => {
    const uniqueSuffixForFiles = Date.now();
    const originalFileName = file.originalname.split(".")[0];
    cb(null, `${uniqueSuffixForFiles}_${originalFileName}${path.extname(file.originalname)}`);
  },
});

const uploader = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, //5MB Max file for upload
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png/;
    const testFileExtension = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (testFileExtension && mime) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed"));
    }
  },
});
const { loginAgainPrevention } = require("./middlewares/session");
app.get("/", loginAgainPrevention, (req, res) => {
  return res.render("home", { user: req.session.user });
});
app.get("/my-panel", (req, res) => {
  return res.status(200).render("panel");
});

app.get("/verify-acc/:token", (req, res) => {
  const token = req.params.token;
  res.send(token);
});
app.get("/signup", (req, res) => {
  return res.render("signup");
});

app.get("/verify-email", async (req, res) => {
  const { email } = req.query;
  try {
    if (!email) {
      return res.status(400).json({
        error: "session expired, Please try again",
      });
    }

    const result = await pool.query(`SELECT id FROM users WHERE email = $1`, [email]);
    if (result.rows.length === 0) {
      res.status(400).json({
        error: "Create an account first",
      });
      return res.redirect("/signup");
    }
    const userData = result.rows[0];
    const result2 = await pool.query(`SELECT userid FROM verification WHERE userid = $1`, [userData.id]);
    if (result2.rows.length === 0) {
      res.status(400).json({
        message: "email is already verified, Please login",
      });
      return res.redirect("/login-user");
    }

    res.render("emailCon");
  } catch (error) {
    const errMsg = error.message || error.messages;
    console.log(errMsg);
  }
});

// =========== RESEND EMAIL ===============

const { sendVerificationEmail } = require("./config/email");
const { generateVerificationToken } = require("./utils/token");

app.post("/resend-email-verification", async (req, res) => {
  const { email } = req.query;
  try {
    const result = await pool.query(`SELECT id FROM users WHERE email = $1`, [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({
        error: "session expired try again",
      });
    }
    const data = result.rows[0];
    const result2 = await pool.query(`SELECT userid FROM verification WHERE userid =$1`, [data.id]);
    if (result2.rows.length === 0) {
      return res.redirect("/login-user");
    }
    const rawToken = generateVerificationToken();
    const finalData = result2.rows[0];
    await pool.query(`UPDATE verification SET verficationtoken =$1,  expiresat = NOW() + INTERVAL '10 minutes' WHERE userid = $2`, [rawToken, finalData.userid]);
    await sendVerificationEmail(email, rawToken);
    return res.status(200).json({
      message: "email sent, check your email",
    });
  } catch (error) {
    const errMsg = error.message || error.messages;
    console.log(errMsg);
    return res.status(500).json({
      error: "something went wrong",
    });
  }
});

const usersignup = require("./schemas/userSchemas");
const validateRequest = require("./middlewares/validateSchemas");

const { transporter, mailOptions } = require("./config/email");
const { error } = require("console");

// app.post('/signup-post', validateRequest(usersignup), (req,res)=>{

//   res.redirect('/verify-email')
//   res.json({
//     message: 'ejiwefiegbj jijgkuighvb jkvi'
//   })

// })

app.listen(process.env.PORT, () => {
  console.log(`app is running on port ${process.env.PORT}`);
});
