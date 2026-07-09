import nodemailer from "nodemailer";

export async function sendContactMail({ name, email, message }) {
    if (!process.env.SMTP_HOST) {
        console.log(`📬 (no SMTP configured) Message from ${name} <${email}>: ${message}`);
        return;
    }
    const transport = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    await transport.sendMail({
        from: `"Portfolio" <${process.env.SMTP_USER}>`,
        to: process.env.MAIL_TO,
        replyTo: email,
        subject: `New message from ${name}`,
        text: message,
    });
}
