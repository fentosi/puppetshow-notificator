const dotenv = require('dotenv');
const { sendEmailNotificationAboutNewShows } = require("../src/sendEmailNotificationAboutNewShows");
const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");
const mongo = require("../helpers/mongo");
const argv = yargs(hideBin(process.argv)).parse()

dotenv.config();

const dayGroups = process.env.DAY_GROUP?.split(',').map((group) => group.trim());
const ageGroups = process.env.AGE_GROUP?.split(',').map((group) => group.trim());

(async () => {
  await mongo.connect(process.env.MONGO_URI);
  await sendEmailNotificationAboutNewShows(ageGroups, dayGroups, !!argv.dryRun);
  await mongo.disconnect()
  process.exit(0);
})();
