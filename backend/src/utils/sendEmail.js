import nodemailer from 'nodemailer'
import { ENV } from '../config/env.js';

const transporter = nodemailer.createTransport({
    service: ENV.SERVICE,
    port: Number(ENV.MAILER_PORT),
    secure: Boolean(ENV.SECURE),
    auth: {
        user: ENV.EMAIL_USER,
        pass: ENV.EMAIL_PASS,
    },
});

export const sendVerificationEmail = async (to, verificationLink) => {
    try {
        await transporter.sendMail({
            from: `"MedBloom Support" <${ENV.EMAIL_USER}>`,
            to: to,
            subject: "Please verify your email address",
            html: `
        <div style="
            font-family: Arial, sans-serif;
            background: linear-gradient(to bottom right, #d4f0e1, #c8f1f7);
            padding: 50px 0;
        ">
            <div style="
            max-width: 500px;
            margin: auto;
            background: #FFFFFF;
            border-radius: 20px;
            padding: 40px 30px;
            text-align: center;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            ">
            <!-- Logo -->
            <p style="color: #000000; font-size: 40px; font-weight: bold; font-family: sans-serif;">
  MED<span style="color: #00A4A3;">BLOOM</span>
</p>
            <!-- Heading -->
            <h2 style="color: #111; font-size: 22px; margin-bottom: 15px;">Please verify your email address</h2>

            <!-- Message -->
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 30px;">
                Thank you for joining MedBloom! To activate your account, please click the button below to confirm your email.
            </p>

            <!-- Button -->
            <a href="${verificationLink}" style="
                display: inline-block;
                background: linear-gradient(90deg, #00737A, #00C8C7);
                color: white;
                padding: 12px 30px;
                border-radius: 8px;
                text-decoration: none;
                font-weight: bold;
                font-size: 16px;
            ">Verify Email</a>

            <!-- Footer -->
            <p style="color: #999; font-size: 12px; margin-top: 30px;">
                If you didn't create an account, please ignore this email.
            </p>
            </div>
        </div>
        `,
        });

    } catch (error) {
        console.log("Internal server error while sending mail ", error)
    }
}

export const sendAppointmentConfirmationEmail = async (to, doctorName, date, time) => {
    try {
        await transporter.sendMail({
            from: `"MedBloom Appointments" <${ENV.EMAIL_USER}>`,
            to: to,
            subject: "Your Appointment is Confirmed - MedBloom",
            html: `
        <div style="
            font-family: Arial, sans-serif;
            background: linear-gradient(to bottom right, #eaf6f6, #c8f1f7);
            padding: 50px 0;
        ">
            <div style="
            max-width: 550px;
            margin: auto;
            background: #FFFFFF;
            border-radius: 20px;
            padding: 40px 30px;
            text-align: center;
            box-shadow: 0 8px 30px rgba(0,164,163,0.15);
            border-top: 5px solid #00A4A3;
            ">
            <p style="color: #000000; font-size: 32px; font-weight: bold; margin-bottom: 10px;">
                MED<span style="color: #00A4A3;">BLOOM</span>
            </p>
            
            <h2 style="color: #111; font-size: 24px; margin-bottom: 25px;">Booking Confirmed! ✔</h2>

            <div style="background: #f8fafc; padding: 20px; border-radius: 12px; text-align: left; margin-bottom: 30px; border: 1px solid #e2e8f0;">
                <p style="color: #555; font-size: 16px; margin: 10px 0;"><strong>Doctor:</strong> Dr. ${doctorName}</p>
                <p style="color: #555; font-size: 16px; margin: 10px 0;"><strong>Date:</strong> ${date}</p>
                <p style="color: #555; font-size: 16px; margin: 10px 0;"><strong>Time:</strong> ${time}</p>
            </div>

            <p style="color: #555; font-size: 15px; line-height: 1.6; margin-bottom: 30px;">
                Your appointment has been successfully booked. Please arrive 10 minutes early. We wish you a healthy and pleasant experience!
            </p>

            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/patient/appointments" style="
                display: inline-block;
                background: linear-gradient(90deg, #00A4A3, #00C8C7);
                color: white;
                padding: 14px 35px;
                border-radius: 10px;
                text-decoration: none;
                font-weight: bold;
                font-size: 16px;
                box-shadow: 0 4px 15px rgba(0,164,163,0.3);
            ">View My Appointments</a>

            <p style="color: #999; font-size: 12px; margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px;">
                If you need to reschedule or cancel, please do so at least 24 hours in advance via your dashboard.
            </p>
            </div>
        </div>
        `,
        });
    } catch (error) {
        console.log("Internal server error while sending confirmation mail", error);
    }
}
