import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(req: Request) {
  const { email, otp } = await req.json()
  if (!email || !otp) {
    return NextResponse.json({ message: "Missing email or OTP" }, { status: 400 })
  }

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
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ message: "Failed to send email", error }, { status: 500 })
  }
}
