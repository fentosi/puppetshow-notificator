const puppetShow = require('./puppetShow');
const mailer = require('./mailer');
const dotenv = require('dotenv');
const { Firestore } = require('@google-cloud/firestore');

dotenv.config();

const dayGroups = process.env.DAY_GROUP.split(',').map((group) => group.trim());
const ageGroups = process.env.AGE_GROUP.split(',').map((group) => group.trim());
const keyFilename = 'gcp-credentials.json';
const projectId = process.env.FIRESTORE_PROJECT_ID;

const main = async () => {

    const firestore = new Firestore({projectId, keyFilename});
    let collectionRef = firestore.collection('shows');

    const shows = await puppetShow.getShows(ageGroups, dayGroups);
    shows.forEach(async (show) => {
        await collectionRef.add(show);
    });

    if (shows.length > 0) {
        const emailContent = mailer.getEmailContent(shows);
        await mailer.sendMail(mailer.getEmail(emailContent));
    }
};

main();




