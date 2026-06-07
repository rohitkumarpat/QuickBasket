import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (
  to: string,
  subject: string,
  html: string
) => {

  const info = await transporter.sendMail({
    from: `QuickBasket <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });

  return info;
};