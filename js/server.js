const http = require('http');
const PORT = process.env.PORT || 1337;
const express = require('express');

const keys = require('./config');
const accountSid = keys.accountSid;
const authToken = keys.authToken;

const bodyParser = require('body-parser');

const client = require('twilio')(accountSid, authToken);
const MessagingResponse = require('twilio').twiml.MessagingResponse;


const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/sms', (req, res) => {
    const twiml = new MessagingResponse();
    twiml.message(`Sup girl, it's ya boo.`);
    res.writeHead(200, {"content-type":"text/xml"});
    res.end(twiml.toString());
});

app.post('/intro', (req, res) => {
    res.header('Content-Type', 'application/json');
    client.messages
      .create({
        from: '+16507358169',
        to: req.body.phone,
        body: `Hey ${req.body.userName}, it's @boo checkin up on you. Stay sexy like you always do.`
      })
      .then(() => {
        res.send(JSON.stringify({ success: true }));
      })
      .catch(err => {
        console.log(err);
        res.send(JSON.stringify({ success: false }));
      });
  });

http.createServer(app).listen(PORT, () => {
    console.log('Express server listening on port 1337')
});