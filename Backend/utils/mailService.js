import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerification = async (toEmail, token) => {
  // Gunakan ENV agar link berubah otomatis saat di production (bukan localhost terus)
  const baseUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const link = `${baseUrl}/success-verification?token=${token}`;

  await transporter.sendMail({
    from: `Finance tracker <${process.env.EMAIL_USER}>`, // Lebih terlihat profesional
    to: toEmail,
    subject: "Verifikasi Email Anda",
    // Gunakan tanda kutip pada href untuk mencegah error HTML
    html: `
      <div style="font-family: sans-serif; line-height: 1.5;">
        <p>Halo,</p>
        <p>Silakan klik tombol di bawah ini untuk memverifikasi email Anda. Link ini akan kedaluwarsa dalam 15 menit:</p>
        <a href="${link}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Verifikasi Email Sekarang
        </a>
        <p>Atau copy-paste link berikut ke browser Anda:</p>
        <p><small>${link}</small></p>
      </div>
    `,
  });
};
