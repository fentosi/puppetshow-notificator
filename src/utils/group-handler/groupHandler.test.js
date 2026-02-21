const { isWithinAgeGroup, isWithinDayGroup } = require('./groupHandler');

describe('groupHandler', () => {
  describe('isWithinAgeGroup', () => {

    [
      { ageGroups: [], expectedValue: true },
      { ageGroups: [2, 4, 6], expectedValue: true },
      { ageGroups: [3,9], expectedValue: false }
    ].forEach(({ ageGroups, expectedValue }) => {
      it(`returns ${expectedValue} for ageGroups: ${JSON.stringify(ageGroups)}`, () => {
        expect(isWithinAgeGroup(ageGroups, 4)).toBe(expectedValue);
      });
    });
  });

  describe('isWithinDayGroup', () => {
    [
      { dayGroups: [], expectedValue: true },
      { dayGroups: ['Monday', 'Tuesday'], expectedValue: true },
      { dayGroups: ['Wednesday', 'Friday'], expectedValue: false },
    ].forEach(({ dayGroups, expectedValue }) => {
      it(`returns ${expectedValue} for dayGroup: ${JSON.stringify(dayGroups)}`, () => {
        expect(isWithinDayGroup(dayGroups, 'tuesday')).toBe(expectedValue);
      })
    });
  });
});

