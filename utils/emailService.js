import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (to, subject, templateName, data) => {
  try {
    const templatePath = path.join(process.cwd(), "views", `${templateName}.ejs`);

    const html = await ejs.renderFile(templatePath, data);

    const mailOptions = {
      from: `"Your App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
