const nodemailer = require("nodemailer");
const cheerio = require("cheerio");

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
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      },
    });

    await transporter.sendMail(mail);
};


