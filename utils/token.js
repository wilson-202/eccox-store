const crypto = require('crypto')
const { func } = require('joi')


function generateVerificationToken(){
  return crypto.randomBytes(32).toString('hex')
}

function hashToken(rawToken){
  return crypto.createHash('sha256').update(rawToken).digest('hex')
}

function generateOTP(){
  return crypto.randomInt(0, 1000000).toString().padStart(6, '0')
}

module.exports = {generateVerificationToken, hashToken, generateOTP }
