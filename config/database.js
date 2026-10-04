const { Pool } = require("pg");
require("dotenv").config();
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionString: process.env.DATABASE_URL,
  max: 20,
});

const createTablesQuery = `
 CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firstName VARCHAR(200) NOT NULL,
  lastName VARCHAR(200) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(100) NOT NULL,
  emailVerified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS passwordresets (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    userid UUID REFERENCES users(id) ON DELETE CASCADE,
    otpcode CHAR(6) NOT NULL,
    expiresAt TIMESTAMP NOT NULL
 

  );


  CREATE TABLE IF NOT EXISTS verification (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    userid UUID REFERENCES users(id) ON DELETE CASCADE,
    usersEmail VARCHAR(200),
    verficationToken VARCHAR(255),
    VerficationStatus BOOLEAN DEFAULT FALSE,
    expiresAt TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()

  );
`;

//  profileimage VARCHAR(255),
//     mobilenumber VARCHAR(255),
//     gender VARCHAR(255),
//     dob VARCHAR(200),
//     address VARCHAR(255)

// name VARCHAR(255),
// description TEXT,
// sellingPrice  DECIMAL(12,2),
// contact VARCHAR(100),
// productImageOrVideo VARCHAR(255),
// discountPercent INT DEFAULT 0,
// costPrice DECIMAL (12, 2)

pool.connect((err, client, release) => {
  if (err) {
    return console.error("Connection error:", err.stack);
  }

  console.log("Connected to PostgreSQL database");

  client.query(createTablesQuery, (queryErr, res) => {
    release();

    if (queryErr) {
      console.error("Error creating tables:", queryErr.stack);
    } else {
      console.log("Database tables verified/created successfully.");
    }
  });
});

module.exports = pool;
