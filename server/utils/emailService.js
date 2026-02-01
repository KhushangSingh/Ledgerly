const { Resend } = require('resend');

const sendEmail = async (options) => {
    // If no API key (dev mode), use console.log
    if (!process.env.RESEND_API_KEY) {
        console.log('DEV MODE EMAIL:', options);
        return true;
    }

    try {
        const resend = new Resend(process.env.RESEND_API_KEY);

        await resend.emails.send({
            from: 'Ledgerly <onboarding@resend.dev>', // Use verify domain in production
            to: options.email,
            subject: options.subject,
            html: options.html
        });

        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};

module.exports = sendEmail;
