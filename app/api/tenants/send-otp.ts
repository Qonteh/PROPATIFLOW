import { NextApiRequest, NextApiResponse } from "next"
import nodemailer from "nodemailer"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  const { email, otp } = req.body
  if (!email || !otp) {
    return res.status(400).json({ message: "Missing email or OTP" })
  }

  // Configure your SMTP transport here
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  const mailOptions = {
    from: process.env.SMTP_FROM || "no-reply@propertyflow.com",
    to: email,
    subject: "Your PropertyFlow Tenant Login Details",
    text: `Welcome to PropertyFlow!\n\nYour username: ${email}\nYour one-time password: ${otp}\n\nPlease use these credentials to log in for the first time and set your new password.\n\nThank you!`,
  }

  try {
    await transporter.sendMail(mailOptions)
    return res.status(200).json({ success: true })
  } catch (error) {
    return res.status(500).json({ message: "Failed to send email", error })
  }
}
