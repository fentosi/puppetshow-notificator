const dotenv = require('dotenv');
const { getEmailNotificationAboutNewShows } = require("./getEmailNotificationAboutNewShows");

dotenv.config();

const dayGroups = process.env.DAY_GROUP.split(',').map((group) => group.trim());
const ageGroups = process.env.AGE_GROUP.split(',').map((group) => group.trim());

(async () => {
  await getEmailNotificationAboutNewShows(ageGroups, dayGroups);
  process.exit(0);
})();
