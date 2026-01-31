const nodemailer = require("nodemailer");
const cheerio = require("cheerio");

const mailServer = {
    host: process.env.SMTP_SERVER,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
};

exports.getEmail = (email) => {
    email = cheerio.load(email);
    return {
        from: `${process.env.SENDER_NAME} <${process.env.SENDER_EMAIL}>`,
        to: process.env.RECIPIENTS,
        subject: process.env.EMAIL_SUBJECT, // Subject line
        text: email.text(),
        html: email.html()
    }
};

exports.sendMail = async (mail) => {
    let transporter = nodemailer.createTransport(mailServer);
    await transporter.sendMail(mail);
};


