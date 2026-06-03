// Firebase Admin SDK initialization
const admin = require('firebase-admin');

const initializeFirebase = () => {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  }
};

module.exports = initializeFirebase;
