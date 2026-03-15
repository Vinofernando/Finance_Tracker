// import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
import { Resend } from "resend";

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
//   connectionTimeout: 5000,
// });

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerification = async (toEmail, token) => {
  // Gunakan ENV agar link berubah otomatis saat di production (bukan localhost terus)
  const baseUrl =
    process.env.FRONTEND_URL || "https://FinanceTrackerV.netlify.app";
  const link = `${baseUrl}/success-verification?token=${token}`;

  try {
    const { data, error } = await resend.emails.send({
      from: "Finance Tracker <onboarding@resend.dev>",
      to: toEmail,
      subject: "Verifikasi Email Anda",
      html: `<a href="${link}">Verifikasi Email</a>`,
    });

    if (error) {
      console.error("Email error:", error);
    } else {
      console.log("Email sent:", data);
    }
  } catch (err) {
    console.error("Send failed:", err);
  }
};
