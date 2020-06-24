const functions = require('firebase-functions');
const signPledge = require('./signPledge')

exports.signPledge = functions.https.onRequest((req, res) => {
  signPledge(req, res)
});
