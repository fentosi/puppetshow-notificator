const { Show } = require("../models/show-model");

exports.isInStore = async (date, title) => {
  const show = await Show
    .exists({ date, title })

  return show !== null;
};

exports.addToStore = async (show) =>
  await Show.create(show);
