const { getNewShows } = require("./puppet-show-crawler/puppetShow");
const contentGenerator = require("./email-contact-generator/emailContentGenerator");
const mailer = require("./utils/mailer");

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
