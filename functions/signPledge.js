const escape = require('escape-html');
const admin = require('firebase-admin');
const { v4: uuid } = require('uuid')

admin.initializeApp();

const db = admin.firestore();

// TODO: delete email / password and lock up my gmail again

const signPledge = async (req, res) => {
  let companyName, teamName, numberOfEmployees, state, submitterEmail
  try {
    body = JSON.parse(req.body)
    companyName = escape(body.companyName.toString())
    teamName = escape(body.teamName.toString())
    numberOfEmployees = escape(body.numberOfEmployees.toString())
    state = escape(body.state.toString())
    submitterEmail = escape(body.submitterEmail.toString())
  
    if (
      !companyName || 
      !numberOfEmployees || 
      !(!state || state.length === 2) || 
      !submitterEmail || 
      submitterEmail.match(/.+@.+/) === null
    ) {
      throw new Error('failed validation')
    }
  } catch (error) {
    res.json({ success: false })
    return
  }

  const docRef = db.collection('pledges').doc(uuid());

  await docRef.set({
    companyName,
    teamName,
    numberOfEmployees,
    state,
    submitterEmail,
  });

  res.send({ success: true })
}

module.exports = signPledge