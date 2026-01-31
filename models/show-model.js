'use strict';

const { mongoose } = require("../helpers/mongo");

const showSchema = new mongoose.Schema({
  date: { type: String, required: true },
  hour: { type: String, required: true },
  title: { type: String, required: true },
  dayGroup: { type: String, required: true },
  ageGroup: { type: String, required: true },
  link: { type: String, required: true },
}, { timestamps: true });

showSchema.index(
  {
    title: 1,
    date: 1,
    hour: 1
  },
  { background: true }
);

exports.Show = mongoose.model('Show', showSchema);
