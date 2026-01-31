const { getNewShows } = require("./puppetShow");
const contentGenerator = require("./contentGenerator");
const mailer = require("./mailer");

exports.sendEmailNotificationAboutNewShows = async (ageGroups = [], dayGroups = [], dryRun = false) => {
  const newShows = await getNewShows(ageGroups, dayGroups);
  const htmlContent = contentGenerator.getHtmlContent(newShows);

  if (newShows.length > 0) {
    if (dryRun) {
      console.log("Dry run mode - new shows:", newShows);
      return;
    }

    await mailer.sendMail(mailer.getEmail(htmlContent));
  }
}
