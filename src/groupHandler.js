exports.isWithinAgeGroup = (ageGroups, age) => {
    return ageGroups.length === 0 || ageGroups.includes(age);
};

exports.isWithinDayGroup = (dayGroups, day) => {
    return dayGroups.length === 0 || dayGroups.includes(day);
};
