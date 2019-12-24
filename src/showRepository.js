const dotenv = require('dotenv');
const { Firestore } = require('@google-cloud/firestore');

dotenv.config();

const keyFilename = 'gcp-credentials.json';
const projectId = process.env.FIRESTORE_PROJECT_ID;
const firestore = new Firestore({projectId, keyFilename});
let collectionRef = firestore.collection('shows');

exports.isInStore = async (date, title) => {
    const querySnapshot = await collectionRef
        .where('date', '==', date)
        .where('title', '==', title)
        .get();
    return querySnapshot.size !== 0;
};

exports.addToStore = async (show) => {
   await collectionRef.add(show);
};
