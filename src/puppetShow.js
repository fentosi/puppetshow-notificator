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
