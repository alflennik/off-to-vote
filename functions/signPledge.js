var escape = require('escape-html');
var nodemailer = require('nodemailer');
const functions = require('firebase-functions');

const signPledge = (req, res) => {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'alexflenniken@gmail.com',
      pass: functions.config().email.password
    }
  });

  let companyName, teamName, numberOfEmployees, state, submitterEmail
  try {
    body = JSON.parse(req.body)
    companyName = body.companyName
    teamName = body.teamName
    numberOfEmployees = body.numberOfEmployees
    state = body.state
    submitterEmail = body.submitterEmail
  
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

  var mailOptions = {
    from: 'alexflenniken@gmail.com',
    to: 'alexflenniken@gmail.com',
    subject: 'Off To Vote Pledges',
    html: `
      Company name: ${escape(companyName)}<br>
      Team name: ${escape(teamName)}<br>
      Number of Employees: ${escape(numberOfEmployees)}<br>
      State: ${escape(state)}<br>
      Submitter email: ${escape(submitterEmail)}
    `
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      throw error
    } else {
      res.json({ success: true });
    }
  });
}

module.exports = signPledge