const { getNewShows } = require('./puppetShow');
const axios = require('axios');
const showRepository = require('./showRepository');

jest.mock('axios');
jest.mock('./showRepository');

describe('puppetShow', () => {
  describe('getNewShows', () => {
    const mockHtmlResponse = `
      <html>
        <body>
          <table id="example">
            <tr>
              <td>2026-01-15</td>
              <td></td>
              <td>Monday</td>
              <td></td>
              <td>3+</td>
              <td></td>
              <td>Babszinhaz Show</td>
              <td><a href="https://tickets.example.com/1">Buy</a></td>
            </tr>
            <tr>
              <td>2026-01-20</td>
              <td></td>
              <td>Saturday</td>
              <td></td>
              <td>5+</td>
              <td></td>
              <td>Gyerekeknek</td>
              <td><a href="https://tickets.example.com/2">Buy</a></td>
            </tr>
            <tr>
              <td>2026-01-25</td>
              <td></td>
              <td>Thursday</td>
              <td></td>
              <td>7+</td>
              <td></td>
              <td>Nagy Gyerekeknek</td>
              <td><a href="https://tickets.example.com/3">Buy</a></td>
            </tr>
            <tr>
              <td>2026-02-01</td>
              <td></td>
              <td>Sunday</td>
              <td></td>
              <td>4+</td>
              <td></td>
              <td>No Link Show</td>
              <td></td>
            </tr>
          </table>
        </body>
      </html>
    `;

    beforeEach(() => {
      process.env.SITE_URL = 'https://example.com/shows';
      axios.get.mockResolvedValue({ data: mockHtmlResponse });
      showRepository.isInStore.mockResolvedValue(false);
      showRepository.addToStore.mockResolvedValue();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('fetches data from site', async () => {
      await getNewShows([], []);

      expect(axios.get).toHaveBeenCalledWith('https://example.com/shows');
    });

    it('returns empty array when all shows are already in store', async () => {
      showRepository.isInStore.mockResolvedValue(true);

      const shows = await getNewShows([], []);

      expect(shows).toHaveLength(0);
      expect(showRepository.addToStore).not.toHaveBeenCalled();
    });

    it('returns all new shows when none are in store', async () => {
      const shows = await getNewShows([], []);

      expect(shows).toHaveLength(3);
      expect(shows[0]).toEqual({
        date: '2026-01-15',
        title: 'Babszinhaz Show',
        ageGroup: '3+',
        dayGroup: 'Monday',
        link: 'https://tickets.example.com/1'
      });
      expect(shows[1]).toEqual({
        date: '2026-01-20',
        title: 'Gyerekeknek',
        ageGroup: '5+',
        dayGroup: 'Saturday',
        link: 'https://tickets.example.com/2'
      });
      expect(shows[2]).toEqual({
        date: '2026-01-25',
        title: 'Nagy Gyerekeknek',
        ageGroup: '7+',
        dayGroup: 'Thursday',
        link: 'https://tickets.example.com/3'
      });
      expect(showRepository.addToStore).toHaveBeenCalledTimes(3);
    });

    it('returns only new shows', async () => {
      showRepository.isInStore.mockImplementation((date, title) => {
        return Promise.resolve(title === 'Babszinhaz Show');
      });

      const shows = await getNewShows([], []);

      expect(shows).toHaveLength(2);
      expect(shows[0].title).toBe('Gyerekeknek');
      expect(shows[1].title).toBe('Nagy Gyerekeknek');
      expect(showRepository.isInStore).toHaveBeenCalledTimes(3);
      expect(showRepository.addToStore).toHaveBeenCalledTimes(2);
    });

    it('adds new shows to store', async () => {
      await getNewShows([], []);

      expect(showRepository.addToStore).toHaveBeenCalledWith({
        date: '2026-01-15',
        title: 'Babszinhaz Show',
        ageGroup: '3+',
        dayGroup: 'Monday',
        link: 'https://tickets.example.com/1'
      });
      expect(showRepository.addToStore).toHaveBeenCalledWith({
        date: '2026-01-20',
        title: 'Gyerekeknek',
        ageGroup: '5+',
        dayGroup: 'Saturday',
        link: 'https://tickets.example.com/2'
      });
      expect(showRepository.addToStore).toHaveBeenCalledWith({
        date: '2026-01-25',
        title: 'Nagy Gyerekeknek',
        ageGroup: '7+',
        dayGroup: 'Thursday',
        link: 'https://tickets.example.com/3'
      });
    });

    it('filters new shows by age group', async () => {
      const shows = await getNewShows(["3+", "5+"], []);

      expect(shows).toHaveLength(2);
      expect(shows[0].ageGroup).toBe('3+');
      expect(shows[1].ageGroup).toBe('5+');
    });

    it('filters new shows by day group', async () => {
      const shows = await getNewShows([], ['Monday']);

      expect(shows).toHaveLength(1);
      expect(shows[0].dayGroup).toBe('Monday');
    });

    it('filters new shows by both age and day groups', async () => {
      const shows = await getNewShows(["5+"], ['Saturday']);

      expect(shows).toHaveLength(1);
      expect(shows[0]).toEqual({
        date: '2026-01-20',
        title: 'Gyerekeknek',
        ageGroup: '5+',
        dayGroup: 'Saturday',
        link: 'https://tickets.example.com/2'
      });
    });
  });
});
