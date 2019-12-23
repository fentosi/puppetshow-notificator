const puppetShow = require('./puppetShow');
const mailer = require('./mailer');
const dotenv = require('dotenv');

dotenv.config();

const dayGroups = process.env.DAY_GROUP.split(',').map((group) => group.trim());
const ageGroups = process.env.AGE_GROUP.split(',').map((group) => group.trim());

const main = async () => {
    const shows = await puppetShow.getShows(ageGroups, dayGroups);
    const email = mailer.getEmailContent(shows);

    const mail = {
        from: `${process.env.SENDER_NAME} <${process.env.SENDER_EMAIL}>`,
        to: process.env.RECIPIENTS,
        subject: process.env.EMAIL_SUBJECT, // Subject line
        text: email.text(),
        html: email.html()
    };

    await mailer.sendMail(mail)
};

main();




