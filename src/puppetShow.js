const groupHandler = require('./groupHandler');
const cheerio = require("cheerio");
const axios = require('axios');

const fetchData = async () => {
    const result = await axios.get(process.env.SITE_URL);
    return cheerio.load(result.data);
};

exports.getShows = async (ageGroups, dayGroups) => {
    const $ = await fetchData();
    let shows = [];

    $('table#example tr').each((index, row) => {
        let title = $('td', row).eq(6).text();
        let age = $('td', row).eq(4).text();
        let day = $('td', row).eq(2).text();
        let link = $('td', row).eq(7).find('a');
        let date = $('td', row).eq(0).text();

        if (link.length === 1 && groupHandler.isWithinAgeGroup(ageGroups, age) && groupHandler.isWithinDayGroup(dayGroups, day)) {
            shows.push({
                date, title, ageGroup: age, dayGroup: day, link: $(link).attr('href')
            });
        }
    });

    return shows;
};
