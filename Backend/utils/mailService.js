// import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
console.log(process.env.RESEND_API_KEY);
export const sendVerification = async (toEmail, token) => {
  const baseUrl = process.env.FRONTEND_URL || "https://finance-tracker.store";
  const link = `${baseUrl}/success-verification?token=${token}`;

  try {
    const { data, error } = await resend.emails.send({
      from: "Finance Tracker <noreply@finance-tracker.store>",
      to: toEmail,
      subject: "Verifikasi Email Anda",
      html: `<a href="${link}">Verifikasi Email</a>`,
    });

    if (error) {
      console.log("API KEY:", process.env.RESEND_API_KEY);
      console.error("Email error:", error);
    } else {
      console.log("Email sent:", data);
    }
  } catch (err) {
    console.error("Send failed:", err);
  }
};

export const sendResetPassLink = async (toEmail, token) => {
  const baseUrl = process.env.FRONTEND_URL || "https://finance-tracker.store";
  const link = `${baseUrl}/reset-page?token=${token}`;

  try {
    const { data, error } = await resend.emails.send({
      from: "Finance Tracker <noreply@finance-tracker.store>",
      to: toEmail,
      subject: "Reset password",
      html: `<h1>Link untuk reset password</h1> <p>Klik link berikut untuk reset password <a href="${link}">Reset password</a></p>`,
    });

    if (error) {
      console.log("API KEY:", process.env.RESEND_API_KEY);
      console.error("Email error:", error);
    } else {
      console.log("Email sent:", data);
    }
  } catch (err) {
    console.error("Send failed:", err);
  }
};
