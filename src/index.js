const puppetShow = require('./puppetShow');
const mailer = require('./mailer');
const dotenv = require('dotenv');

dotenv.config();

const dayGroups = process.env.DAY_GROUP.split(',').map((group) => group.trim());
const ageGroups = process.env.AGE_GROUP.split(',').map((group) => group.trim());

const main = async () => {
    const shows = await puppetShow.getShows(ageGroups, dayGroups);

    if (shows.length > 0) {
        const emailContent = mailer.getEmailContent(shows);
        await mailer.sendMail(mailer.getEmail(emailContent));
    }
};

main();




