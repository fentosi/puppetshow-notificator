const { getNewShows } = require("./puppetShow");
const contentGenerator = require("./contentGenerator");
const mailer = require("./mailer");

exports.sendEmailNotificationAboutNewShows = async (ageGroups = [], dayGroups = []) => {
  const newShows = await getNewShows(ageGroups, dayGroups);
  const htmlContent = contentGenerator.getHtmlContent(newShows);

  if (newShows.length > 0) {
    await mailer.sendMail(mailer.getEmail(htmlContent));
  }
}
