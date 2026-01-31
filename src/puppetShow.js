const groupHandler = require('./groupHandler');
const cheerio = require("cheerio");
const axios = require('axios');
const showRepository = require('./showRepository');

const fetchData = async () => {
    const result = await axios.get(process.env.SITE_URL);
    return cheerio.load(result.data);
};

const getShows = async (ageGroups, dayGroups) => {
    const $ = await fetchData();
    let shows = [];

    $('.programsColumn .col-12').each((index, row) => {
      let title = $('.programBoxInformations h4', row).text();
      let dateInfo=$('.programBoxDate', row).text().split(/\r?\n/).map((dateData) => {
        if (dateData.length > 0) {
          return dateData.trim();
        }
      }).filter(dateData => dateData);

      let date = dateInfo[0];
      let day = dateInfo[1];
      let hour = dateInfo[2];

      let age = $('.programTicketLink .ageLimit span', row).text();
      let link = $('.programTicketLink', row).find('a');

      if (link.length === 1 && groupHandler.isWithinAgeGroup(ageGroups, age) && groupHandler.isWithinDayGroup(dayGroups, day)) {
            shows.push({
                date, title, dayGroup: day, hour, ageGroup: age, link: $(link).attr('href')
            });
        }
    });

    return shows;
};

exports.getNewShows = async (ageGroups, dayGroups) => {
  const newShows = [];

  const availableShows = await getShows(ageGroups, dayGroups);
  for (const availableShow of availableShows) {
    const isInStore = await showRepository.isInStore(availableShow.date, availableShow.title);
    if (!isInStore) {
      await showRepository.addToStore(availableShow);
      newShows.push(availableShow);
    }
  }

  return newShows;
}
