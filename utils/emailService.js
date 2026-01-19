import nodemailer from "nodemailer";

const EMAIL_FROM = process.env.EMAIL_FROM || "no-reply@yourdomain.com";

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "sendgrid",
  auth: {
    user: "apikey", // For SendGrid, user is always 'apikey'
    pass: process.env.SENDGRID_API_KEY,
  },
});

// Send email to any address
export async function sendEmail({ to, subject, html, text }) {
  try {
    const mailOptions = {
      from: EMAIL_FROM,
      to,
      subject,
      text,
      html,
    };
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (err) {
    console.error("Email Sending Error:", err);
    throw err;
  }
}

// Helper: Send OTP email (you can call this from your controller)
export async function sendOtpEmail(to, otpCode) {
  return sendEmail({
    to,
    subject: "Your OTP Verification Code",
    html: `<div>
      <h2>Your OTP Code: <span style="color:blue">${otpCode}</span></h2>
      <p>This code will expire after 10 minutes.<br>
      If this is not you, please ignore this message.</p>
    </div>`,
  });
}
