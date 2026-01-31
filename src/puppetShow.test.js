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
          <section class="mt-105">
            <div class="container">
              <div class="programsColumn">
                 <div class="row">
                    <div class="col-12">
                       <div class="programBox">
                          <div class="programBoxInner">
                             <div class="programBoxInformations">
                                <a target="_blank" href="/eloadasok/4-babszinhaz-show">
                                   <h4>Babszinhaz Show</h4>
                                </a>
                             </div>
                          </div>
                          <div class="programTicketLink">
                             <p class="programBoxDate">
                                2026.01.15.&nbsp;
                                szombat
                                &nbsp;19:00
                             </p>
                             <div class="d-none d-lg-block">
                                <div class="ageLimit">
                                   <span>3+</span>
                                </div>
                             </div>
                             <a target="_blank" href="https://tickets.example.com/1" class="btnDisabled btn btn-primary">
                              <span>Elfogyott</span>
                             </a>
                          </div>
                       </div>
                    </div>
                    <div class="col-12">
                       <div class="programBox">
                          <div class="programBoxInner">
                             <div class="programBoxInformations">
                                <a target="_blank" href="/eloadasok/13-gyerekeknek">
                                   <h4>Gyerekeknek</h4>
                                </a>
                             </div>
                          </div>
                          <div class="programTicketLink">
                             <p class="programBoxDate">
                                2026.01.20.&nbsp;
                                vasárnap
                                &nbsp;10:30
                             </p>
                             <div class="d-none d-lg-block">
                                <div class="ageLimit">
                                   <span>5+</span>
                                </div>
                             </div>
                             <a target="_blank" href="https://tickets.example.com/2" class=" btn btn-primary">
                             <span>Jegyvásárlás</span>
                             </a>
                          </div>
                       </div>
                    </div>
                    <div class="col-12">
                       <div class="programBox">
                          <div class="programBoxInner">
                             <div class="programBoxInformations">
                                <a target="_blank" href="/eloadasok/13-nagy-gyerekeknek">
                                   <h4>Nagy Gyerekeknek</h4>
                                </a>
                             </div>
                          </div>
                          <div class="programTicketLink">
                             <p class="programBoxDate">
                                2026.01.25.&nbsp;
                                vasárnap
                                &nbsp;15:00
                             </p>
                             <div class="d-none d-lg-block">
                                <div class="ageLimit">
                                   <span>9+</span>
                                </div>
                             </div>
                             <a target="_blank" href="https://tickets.example.com/3" class=" btn btn-primary">
                             <span>Jegyvásárlás</span>
                             </a>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </section>
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
        date: '2026.01.15.',
        dayGroup: 'szombat',
        hour: '19:00',
        title: 'Babszinhaz Show',
        ageGroup: '3+',
        link: 'https://tickets.example.com/1'
      });
      expect(shows[1]).toEqual({
        date: '2026.01.20.',
        dayGroup: 'vasárnap',
        hour: '10:30',
        title: 'Gyerekeknek',
        ageGroup: '5+',
        link: 'https://tickets.example.com/2'
      });
      expect(shows[2]).toEqual({
        date: '2026.01.25.',
        dayGroup: 'vasárnap',
        hour: '15:00',
        title: 'Nagy Gyerekeknek',
        ageGroup: '9+',
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
        date: '2026.01.15.',
        dayGroup: 'szombat',
        hour: '19:00',
        title: 'Babszinhaz Show',
        ageGroup: '3+',
        link: 'https://tickets.example.com/1'

      });
      expect(showRepository.addToStore).toHaveBeenCalledWith({
        date: '2026.01.20.',
        dayGroup: 'vasárnap',
        hour: '10:30',
        title: 'Gyerekeknek',
        ageGroup: '5+',
        link: 'https://tickets.example.com/2'
      });
      expect(showRepository.addToStore).toHaveBeenCalledWith({
        date: '2026.01.25.',
        dayGroup: 'vasárnap',
        hour: '15:00',
        title: 'Nagy Gyerekeknek',
        ageGroup: '9+',
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
      const shows = await getNewShows([], ['szombat']);

      expect(shows).toHaveLength(1);
      expect(shows[0].dayGroup).toBe('szombat');
    });

    it('filters new shows by both age and day groups', async () => {
      const shows = await getNewShows(['5+'], ['vasárnap']);

      expect(shows).toHaveLength(1);
      expect(shows[0]).toEqual({
        date: '2026.01.20.',
        hour: "10:30",
        title: 'Gyerekeknek',
        ageGroup: '5+',
        dayGroup: 'vasárnap',
        link: 'https://tickets.example.com/2'
      });
    });
  });
});
