const { getHtmlContent } = require('./contentGenerator');

describe('getHtmlContent', () => {

  it('renders fallback message when no shows', () => {
    const html = getHtmlContent([]);
    expect(html).toContain('Nincs uj eloadas');
  });

  it('renders show data correctly', () => {
    const shows = [
      {
        date: '2026-01-15',
        title: 'Babszinhaz Show',
        ageGroup: '3+',
        link: 'https://tickets.example.com/1'
      },
      {
        date: '2026-01-20',
        title: 'Gyerekeknek',
        ageGroup: '5+',
        link: 'https://tickets.example.com/2'
      }
    ];

    const html = getHtmlContent(shows);
    expect(html).toContain('Babszinhaz Show');
    expect(html).toContain('Gyerekeknek');
    expect(html).toContain('2026-01-15');
    expect(html).toContain('2026-01-20');
    expect(html).toContain('3+');
    expect(html).toContain('5+');
    expect(html).toContain('https:&#x2F;&#x2F;tickets.example.com&#x2F;1');
    expect(html).toContain('https:&#x2F;&#x2F;tickets.example.com&#x2F;2');
  });
});
