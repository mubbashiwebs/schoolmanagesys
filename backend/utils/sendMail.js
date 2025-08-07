import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendVerificationEmail = async (to, token) => {
  await transporter.sendMail({
    from:process.env.SMTP_USER,
    to,
    subject: "Verify your email",
    html: `<p>Click below to verify:</p><a href="${process.env.BASE_URL}/api/verify?token=${token}">Verify Email</a>`,
  });
};

export const sendSchoolStatusEmail = async (to, status) => {
  const html =
    status === "approved"
      ? `<p>Congratulations! Your school is approved. You will receive dashboard ID in next email.</p>`
      : `<p>Sorry! Your school request was rejected.</p>`;

  await transporter.sendMail({
    from:process.env.SMTP_USER,
    to,
    subject: `School Request ${status}`,
    html,
  });
};
