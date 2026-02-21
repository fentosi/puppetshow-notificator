const fs = require('fs');
const mustache = require("mustache");
const path = require("path");

exports.getHtmlContent = (shows) => {
    const emailTemplate = fs.readFileSync(path.resolve(__dirname, "./templates/email.mustache"), 'utf8');
    return mustache.render(emailTemplate, { shows });
};
