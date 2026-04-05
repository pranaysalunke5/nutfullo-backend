// src/config/sendEmail.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false, // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (options) => {
  const mailOptions = {
    from: '"Nutfullo Official" <info@nutfullo.com>',
    to: options.email,
    subject: options.subject,
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: auto; border: 1px solid #e2e8f0; border-radius: 20px; overflow: hidden;">
        <div style="background-color: #10b981; padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 900;">Nutfullo.</h1>
        </div>
        <div style="padding: 40px; background-color: white; text-align: center;">
          <p style="color: #64748b; font-size: 16px;">Hello Partner,</p>
          <p style="color: #1e293b; font-size: 16px;">Your verification code is:</p>
          <div style="margin: 25px 0; padding: 20px; background-color: #f0fdf4; border: 2px dashed #10b981; border-radius: 12px; display: inline-block;">
            <span style="font-size: 32px; font-weight: 900; letter-spacing: 8px; color: #064e3b;">${options.otp}</span>
          </div>
          <p style="color: #94a3b8; font-size: 12px;">This code expires in 10 minutes.</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;