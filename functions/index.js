// const functions = require('firebase-functions');
// const signPledge = require('./signPledge')

// exports.signPledge = functions.https.onRequest((req, res) => {
//   console.log('serving')
//   signPledge(req, res)
// });

const functions = require('firebase-functions')
// const moment = require('moment-timezone')

const serve = (req, res) => {
  res.send('success')
}

exports.serve = functions.https.onRequest(async (req, res) => {
  await serve(req, res)
})
