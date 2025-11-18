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
