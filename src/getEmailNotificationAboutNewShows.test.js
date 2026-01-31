const { getEmailNotificationAboutNewShows } = require('./getEmailNotificationAboutNewShows');
const puppetShow = require('./puppetShow');
const contentGenerator = require('./contentGenerator');
const mailer = require('./mailer');

jest.mock('./puppetShow');
jest.mock('./contentGenerator');
jest.mock('./mailer');

describe('getEmailNotificationAboutNewShows', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('sends an email when there are new shows', async () => {
    const fakeShows = [
      { title: 'Show 1', date: '2026.01.01.', ageGroup: '3+', link: 'https://t/1' },
      { title: 'Show 2', date: '2026.01.02.', ageGroup: '5+', link: 'https://t/2' }
    ];

    puppetShow.getNewShows.mockResolvedValue(fakeShows);
    mailer.getEmail.mockReturnValue({ to: 'x@y.com' });
    mailer.sendMail.mockResolvedValue();

    await getEmailNotificationAboutNewShows();

    expect(contentGenerator.getHtmlContent).toHaveBeenCalledWith(fakeShows);
    expect(puppetShow.getNewShows).toHaveBeenCalled();
    expect(mailer.getEmail).toHaveBeenCalled();
    expect(mailer.sendMail).toHaveBeenCalledWith({ to: 'x@y.com' });
  });

  it('does not send an email when there are no new shows', async () => {
    puppetShow.getNewShows.mockResolvedValue([]);

    await getEmailNotificationAboutNewShows();

    expect(puppetShow.getNewShows).toHaveBeenCalled();
    expect(mailer.getEmail).not.toHaveBeenCalled();
    expect(mailer.sendMail).not.toHaveBeenCalled();
  });
});
