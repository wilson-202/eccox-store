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

const indexRouther = require("./routers/index");
app.use(indexRouther);

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

app.get("/", (req, res) => {
  return res.status(200).render("home");
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

app.get("/verify-email", (req, res) => {
  res.render("emailCon");
});

const usersignup = require("./schemas/userSchemas");
const validateRequest = require("./middlewares/validateSchemas");

const { transporter, mailOptions } = require("./config/email");

// app.post('/signup-post', validateRequest(usersignup), (req,res)=>{

//   res.redirect('/verify-email')
//   res.json({
//     message: 'ejiwefiegbj jijgkuighvb jkvi'
//   })

// })

app.listen(process.env.PORT, () => {
  console.log(`app is running on port ${process.env.PORT}`);
});
