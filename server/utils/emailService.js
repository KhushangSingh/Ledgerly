const nodemailer = require('nodemailer');

const sendOTPEmail = async (email, otp) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail', // or use 'response', 'sendgrid' etc. based on .env
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Verify your Ledgerly Account - OTP',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <h2 style="color: #0055FF; text-align: center;">Welcome to Ledgerly!</h2>
                    <p style="font-size: 16px; color: #333;">Thank you for signing up. Please use the OTP below to verify your email address and activate your account.</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #0055FF; background: #f0f4ff; padding: 10px 20px; border-radius: 5px;">${otp}</span>
                    </div>
                    <p style="font-size: 14px; color: #666;">This OTP is valid for 10 minutes.</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="font-size: 12px; color: #999; text-align: center;">If you didn't request this code, please ignore this email.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`OTP sent to ${email}`);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};

module.exports = sendOTPEmail;
