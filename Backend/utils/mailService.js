import nodemailer from "nodemailer";
const APP_URL = "http://localhost:5000";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerification = async (toEmail, token) => {
  const link = `${APP_URL}/api/auth/verify/${token}`;
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: "Verification email",
    html: `<p>Click this link to verified your email: </p><a href=${link}>${link}</a>`,
  });
};
