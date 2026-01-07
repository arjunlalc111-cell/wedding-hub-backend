// Simple in-memory OTP store (start ke liye best)
const otpStore = {};

export function saveOTP(email, otp) {
  otpStore[email] = {
    otp,
    expires: Date.now() + 5 * 60 * 1000 // 5 minutes
  };
}

export function verifyOTP(email, otp) {
  const data = otpStore[email];
  if (!data) return false;

  if (Date.now() > data.expires) return false;

  return data.otp === otp;
}