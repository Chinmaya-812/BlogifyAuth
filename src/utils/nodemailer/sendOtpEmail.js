import { transporter } from "./nodemailer.js";

export const sendOtpEmail = async (email, otp) => {
  await transporter.sendMail({
    from: '"Blogify" <yourmail@gmail.com>',
    to: email,
    subject: 'Your Login OTP',
    html: `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
    
    <!-- Header -->
    <h2 style="text-align: center; color: #333;">Verify Your Email</h2>
    
    <!-- Body -->
    <p style="font-size: 16px; color: #555;">
      Hi there,
    </p>
    <p style="font-size: 16px; color: #555;">
      You requested a One-Time Password (OTP) to log in to <strong>Blogify App </strong>. Use the OTP below to complete your login:
    </p>
    
    <!-- OTP Box -->
    <div style="text-align: center; margin: 20px 0;">
      <span style="
        display: inline-block;
        font-size: 24px;
        letter-spacing: 8px;
        font-weight: bold;
        color: #1a73e8;
        background: #e8f0fe;
        padding: 10px 20px;
        border-radius: 6px;
      ">${otp}</span>
    </div>
    
    <p style="font-size: 14px; color: #777;">
      This OTP will expire in 5 minutes. Do not share it with anyone.
    </p>
    
    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
    
    <p style="font-size: 12px; color: #999; text-align: center;">
      If you did not request this OTP, please ignore this email.
    </p>

  </div>
  `,
  });

};

export const otpStore = new Map();
