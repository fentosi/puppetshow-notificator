const fs = require('fs');
const mustache = require("mustache");

exports.getHtmlContent = (shows) => {
    const emailTemplate = fs.readFileSync('src/templates/email.mustache', 'utf8');
    return mustache.render(emailTemplate, { shows });
};
