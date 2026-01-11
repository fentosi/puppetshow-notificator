const mailer = require('./mailer');
const contentGenerator = require('./contentGenerator');
const dotenv = require('dotenv');

dotenv.config();

const dayGroups = process.env.DAY_GROUP.split(',').map((group) => group.trim());
const ageGroups = process.env.AGE_GROUP.split(',').map((group) => group.trim());

const express = require('express');
const { getNewShows } = require("./puppetShow");
const app = express();
const port = process.env.PORT || 8080;

app.get('/', async (req, res) => {
    const newShows = await getNewShows(ageGroups, dayGroups);
    const htmlContent = contentGenerator.getHtmlContent(newShows);

    if (newShows.length > 0) {
        await mailer.sendMail(mailer.getEmail(htmlContent));
    }

    res.status(200).send(htmlContent);
});

app.listen(port, () => console.log(`Puppet Show Notificator app is listening on port ${port}!`))




