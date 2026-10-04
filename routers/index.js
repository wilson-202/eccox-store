const express = require('express')
const indexRouther = express.Router()
const authRouther = require('./authRouther')
indexRouther.use(authRouther)
module.exports = indexRouther