const path = require("path");
const fs = require("fs"); // Added to read from your public folder directly
const { Resend } = require("resend");
const nodemailer = require("nodemailer");
require("dotenv").config();

const resend = new Resend(process.env.MAIL_PASSWORD);

// const smtpPort = Number(process.env.MAIL_PORT) || 587;
// // Automatically assigns true ONLY if port is 465, false if it is 587
// const smtpSecure = smtpPort === 465;

// const transporter = nodemailer.createTransport({
//   host: process.env.MAIL_HOST,
//   port: smtpPort,
//   secure: smtpSecure,
//   auth: {
//     user: process.env.MAIL_USERNAME,
//     pass: process.env.MAIL_PASSWORD,
//   },
//   tls: {
//     rejectUnauthorized: false,
//   },
// });

async function sendVerificationEmail(Email, rawToken) {
  try {
    const emailVerifyURL = `${process.env.APP_URL}/verify-email/${rawToken}`;
    const emailHtml = `
      <div style="width: 100%; background-color: #f5f5f4; padding: 40px 0; font-family: sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 24px; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          
          <div style="margin-bottom: 20px;">
            <p style="font-weight: bold; font-size: 20px; color: #c026d3; margin: 0;">Eccox-store</p>
          </div>
          
         
         <div style="margin-bottom: 24px; width: 100%; border-radius: 16px; overflow: hidden;">
            <img style="width: 100%; height: auto; display: block; border-radius: 16px;" src="https://51ts8cwkg8.ucarecd.net/5a26fc89-6146-4cb1-9764-e960ea2e0edd/images4.png" alt="Welcome Image">
          </div>
          
          <div style="margin-bottom: 24px;">
            <p style="font-weight: bold; text-transform: uppercase; color: #444444; margin: 0 0 8px 0;">You're one step away</p>
            <h2 style="font-size: 32px; font-weight: bold; text-transform: capitalize; color: #1c1917; margin: 0 0 16px 0;">Verify your email address</h2>
            <p style="font-weight: normal; color: #444444; line-height: 1.6; margin: 0;">
              To complete your registration and start making use of <span style="font-weight: 500; color: #c026d3;">eccox store</span>, you'll need to verify your email address.
            </p>
          </div>
          
          <div style="width: 100%; text-align: center; margin: 30px 0;">
            <a href="${emailVerifyURL}" style="background-color: #c026d3; color: #f5f5f4; padding: 12px 30px; text-decoration: none; border-radius: 30px; font-weight: bold; display: inline-block; border: 2px solid #a21caf; text-transform: capitalize;">
              Verify Email
            </a>
          </div>
          
          <div style="border-top: 1px solid #d6d3d1; margin-top: 24px; padding-top: 16px;">
            <p style="color: #78716c; font-weight: 500; margin: 0 0 4px 0;">Contact: support@eccox.store</p>
            <p style="color: #78716c; font-weight: 500; margin: 0;">© 2026 eccox.store</p>
          </div>
          
        </div>
      </div>
    `;

    await resend.emails.send({
      from: process.env.MAIL_NAME || process.env.MAIL_USERNAME || "no-reply@example.com",
      to: Email,
      subject: "Email verification",
      html: emailHtml,
    });
    // await transporter.sendMail({
    //   from: process.env.MAIL_NAME || process.env.MAIL_USERNAME || "no-reply@example.com",
    //   to: Email,
    //   subject: "Email verification",
    //   html: emailHtml,
    // });

    return console.log("Email sent successfully! ");
  } catch (smtpError) {
    // console.error("--- NODEMAILER SMTP ERROR DETECTED ---");
    // console.error("Code:", smtpError.code);
    // console.error("Command:", smtpError.command);
    // console.error("Full Error Message:", smtpError.message);
    // console.error("--------------------------------------");
    // throw smtpError; // Pass it up so the main controller catches it too

    console.error("--- RESEND API ERROR DETECTED ---");
    console.error("message:", smtpError.message);
    console.error("--------------------------------------");
    throw smtpError;
  }
}

async function sendOTP(Email, code) {
  try {
    const otpCode = code;
    const resetHtml = `
<table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#e7e5e4" style="font-family: sans-serif; min-height: 100vh; table-layout: fixed;">
  <tr>
    <td align="center" valign="middle" style="padding: 20px 10px;">
      
      <!-- Card Container (Max width 600px replaces md:w-[60%]) -->
      <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" bgcolor="#ffffff" style="max-width: 600px; width: 100%; border-radius: 16px;">
        <tr>
          <td style="padding: 30px 5%;">
            
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
              
              
              <tr>
                <td align="center" style="padding-bottom: 20px;">
                  <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #c026d3;">Eccox-store</h1>
                </td>
              </tr>
              
            
              <tr>
                <td align="center" style="padding-bottom: 15px;">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden;">
                    <tr>
                      <td align="center" height="240" valign="middle">
                      <img src="https://51ts8cwkg8.ucarecd.net/e6daa6bb-df63-4951-a118-a4c804d457fe/comp.png" alt="" width="100%" style="display: block; width: 100%; max-height: 240px; object-fit: contain; border-radius: 16px;">

                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
            
              <tr>
                <td align="left" style="padding-bottom: 15px; font-size: 16px; line-height: 1.5; color: #1c1917; font-weight: 400;">
                  We recevied a password reset attempt with the following code. Please enter it in the browser window where you requested for password reset
                </td>
              </tr>
              
       
              <tr>
                <td align="center" style="padding-bottom: 15px;">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#e7e5e4" style="border-radius: 12px;">
                    <tr>
                      <td align="center" style="padding: 24px 0;">
                        <p style="margin: 0; letter-spacing: 0.05em; font-size: 24px; font-weight: 700; color: #1c1917;">${otpCode}</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
          
              <tr>
                <td align="left" style="padding-bottom: 15px; font-size: 16px; line-height: 1.5; color: #1c1917;">
                  This otp is valid for the <span style="font-weight: 500;">next 10 minutes.</span> Don't share this code with anyone
                </td>
              </tr>
              
        
              <tr>
                <td align="left" style="padding-bottom: 25px; font-size: 16px; line-height: 1.5; color: #1c1917;">
                  if you didn't request this code, please ignore this email
                </td>
              </tr>
              
            
              <tr>
                <td align="center" style="border-top: 1px solid #e5e7eb; padding-top: 15px; font-size: 14px; font-weight: 500; color: #44403c;">
                  © 2026 eccox store. All rights reserved
                </td>
              </tr>
              
            </table>

          </td>
        </tr>
      </table>

    </td>
  </tr>
</table>

 `;
    await resend.emails.send({
      from: process.env.MAIL_NAME || process.env.MAIL_USERNAME || "no-reply@example.com",
      to: Email,
      subject: "Password Reset",
      html: resetHtml,
    });

    return console.log("Email for reset password sent successfully! ");
  } catch (smtpError) {
    console.error("--- RESEND API ERROR DETECTED ---");
    console.error("message:", smtpError.message);
    console.error("--------------------------------------");
    throw smtpError; // Pass it up so the main controller catches it too
  }
}

module.exports = {
  sendVerificationEmail,
  sendOTP,
};
