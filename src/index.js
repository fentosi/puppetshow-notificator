const puppetShow = require('./puppetShow');
const mailer = require('./mailer');
const showRepository = require('./showRepository');
const dotenv = require('dotenv');

dotenv.config();

const dayGroups = process.env.DAY_GROUP.split(',').map((group) => group.trim());
const ageGroups = process.env.AGE_GROUP.split(',').map((group) => group.trim());

const main = async () => {
    const showsToEmail = [];

    const availableShows = await puppetShow.getShows(ageGroups, dayGroups);
    for (const availableShow of availableShows) {
        const isInStore = await showRepository.isInStore(availableShow.date, availableShow.title);
        if (!isInStore) {
            showRepository.addToStore(availableShow).then(() => {
                showsToEmail.push(availableShow);
            });
        }
    }

    if (showsToEmail.length > 0) {
        const emailContent = mailer.getEmailContent(availableShows);
        await mailer.sendMail(mailer.getEmail(emailContent));
    }
};

main();




