const dotenv = require('dotenv');
const { sendEmailNotificationAboutNewShows } = require("../src/getEmailNotificationAboutNewShows");

dotenv.config();

const dayGroups = process.env.DAY_GROUP.split(',').map((group) => group.trim());
const ageGroups = process.env.AGE_GROUP.split(',').map((group) => group.trim());

(async () => {
  await sendEmailNotificationAboutNewShows(ageGroups, dayGroups);
  process.exit(0);
})();
