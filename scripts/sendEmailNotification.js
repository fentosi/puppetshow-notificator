const dotenv = require('dotenv');
const { sendEmailNotificationAboutNewShows } = require("../src/getEmailNotificationAboutNewShows");
const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");
const argv = yargs(hideBin(process.argv)).parse()

dotenv.config();

const dayGroups = process.env.DAY_GROUP.split(',').map((group) => group.trim());
const ageGroups = process.env.AGE_GROUP.split(',').map((group) => group.trim());

(async () => {
  await sendEmailNotificationAboutNewShows(ageGroups, dayGroups, !!argv.dryRun);
  process.exit(0);
})();
