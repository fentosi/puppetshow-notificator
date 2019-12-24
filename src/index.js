const puppetShow = require('./puppetShow');
const mailer = require('./mailer');
const showRepository = require('./showRepository');
const dotenv = require('dotenv');

dotenv.config();

const dayGroups = process.env.DAY_GROUP.split(',').map((group) => group.trim());
const ageGroups = process.env.AGE_GROUP.split(',').map((group) => group.trim());

const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

app.get('/', async (req, res) => {
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

    const htmlContent = mailer.getEmailContent(showsToEmail);

    if (showsToEmail.length > 0) {
        await mailer.sendMail(mailer.getEmail(htmlContent));
    }

    res.status(200).send(htmlContent.html());
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))




