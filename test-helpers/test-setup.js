'use strict';

const dotenv = require('dotenv');
dotenv.config();

const { cloneDeep } = require('lodash');
const mongo = require("../helpers/mongo");
const originalEnv = cloneDeep(process.env);

beforeAll(async () => await mongo.connect(process.env.MONGO_URI));

afterAll(async () => await mongo.disconnect());

beforeEach(async () => {
  process.env = cloneDeep(originalEnv);

  await mongo.deleteAllDocuments();
});

afterEach(async () => {
  await mongo.deleteAllDocuments();
});
