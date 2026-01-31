'use strict';

const mongoose = require('mongoose');

exports.connect = async (uri, options = {}) => {
  mongoose.set('strictQuery', true);
  const mongooseConnectionPromise = mongoose.connect(uri, options);

  return await mongooseConnectionPromise;
};

exports.disconnect = async () => {
  mongoose.connection.removeAllListeners('disconnected');
  return await mongoose.connection.close();
};

exports.deleteAllDocuments = async () => {
  const documents = mongoose.modelNames();
  await Promise.all(documents.map((name) => mongoose.model(name).deleteMany()));
};

exports.mongoose = mongoose;
