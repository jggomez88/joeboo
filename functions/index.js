const functions = require('firebase-functions');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

//Import SMS responses object
const smsResponses = require('./messages');

//Auth for Twilio API
const keys = require('./config');
const accountSid = keys.accountSid;
const authToken = keys.authToken;

//Twilio client and message response instance
const client = require('twilio')(accountSid, authToken);
const MessagingResponse = require('twilio').twiml.MessagingResponse;

//Express app and bodyParser
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

//get current response function
let count = 0;

const getResponse = () => {
  count === smsResponses.length ? count = 0 : count;
  const currentResponse = smsResponses[count];
  count++
  return {currentResponse}
}

app.post('/sms', (req, res) => {
    const currentResponse = getResponse().currentResponse;
    const twiml = new MessagingResponse();

    const message = twiml.message();
    message.body(currentResponse.text);
    message.media(currentResponse.media);
  
    res.writeHead(200, {"content-type":"text/xml"});
    res.end(twiml.toString());
});

app.post('/intro', (req, res) => {
    res.header('Content-Type', 'application/json');

    return client.messages.create({
        from: '+16507358169',
        to: req.body.phone,
        body: `Hey ${req.body.userName}, it's @boo checkin up on you. Send me text, and see what's next.`,
        mediaUrl: ['https://media.giphy.com/media/vi9ob0h5bKmUU/giphy.gif']
      })
      .then((message) => {
        console.log(message.status);
        return res.send(JSON.stringify({ success: true }));
      })
      .catch(err => {
        console.log(err);
        return res.send(JSON.stringify({ success: false }));
      });
  });

//   console.log(accountSid, authToken, smsResponses);

exports.sendSMS = functions.https.onRequest(app);
