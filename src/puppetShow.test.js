const { getShows } = require('./puppetShow');
const axios = require('axios');

jest.mock('axios');

describe('puppetShow', () => {
  describe('getShows', () => {
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
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('fetches data from site', async () => {
      await getShows([], []);

      expect(axios.get).toHaveBeenCalledWith('https://example.com/shows');
    });

    it('returns all shows with link when no filters are applied', async () => {
      const shows = await getShows([], []);

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
    });

    it('filters shows by age group', async () => {
      const shows = await getShows(["3+", "5+"], []);

      expect(shows).toHaveLength(2);
      expect(shows[0].ageGroup).toBe('3+');
      expect(shows[1].ageGroup).toBe('5+');
    });

    it('filters shows by day group', async () => {
      const shows = await getShows([], ['Monday']);

      expect(shows).toHaveLength(1);
      expect(shows[0].dayGroup).toBe('Monday');
    });

    it('filters shows by both age and day groups', async () => {
      const shows = await getShows(["5+"], ['Saturday']);

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

