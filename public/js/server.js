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

const smsResponses = [
  {
    text: "Damn babe, did you do something to your hair? It looks so much better.",
    media: "https://media.giphy.com/media/CiTLZWskt7Fu/giphy.gif",
    type: "compliment"
  },
  {
    text: "You're right. Everyone at work just doesn't get how smart you are. I know... you could run the company but you just don't want to right now. Totally reasonable thought.",
    media: "https://media.giphy.com/media/14rk56liuv7mQo/giphy.gif",
    type: "work"
  },
  {
    text: "Mercury can retrograde all it wants. Nothing can stop you babe, but like, maybe don't rage quit your job.",
    media:"https://media.giphy.com/media/EtB1yylKGGAUg/giphy.gif",
    type: "work"
  },
  {
    text: "Ya 100%. Totally agree. You're so hot when you're always right.",
    media:"https://media.giphy.com/media/WJjLyXCVvro2I/giphy.gif",
    type: "compliment"
  },
  {
    text: "You aren't being dramatic at all. Caren IS a betch.",
    media:"https://media.giphy.com/media/l0HlFiJBXBv2s6ZHi/giphy.gif",
    type: "work"
  },
  {
    text: "Go ahead pour yourself another glass. You'll totally get all that stuff done later like you said you would again.",
    media:"https://media.giphy.com/media/l3q2wCnKRThy8ltxS/giphy.gif",
    type: "drink"
  }
]

let count = 0;

const getResponse = () => {
  count === smsResponses.length ? count = 0 : count;
  const currentResponse = smsResponses[count];
  count++
  return {currentResponse}
}

console.log(getResponse().currentResponse.media);

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
    client.messages
      .create({
        from: '+16507358169',
        to: req.body.phone,
        body: `Hey ${req.body.userName}, it's @boo checkin up on you`,
        mediaUrl: ['https://media.giphy.com/media/vi9ob0h5bKmUU/giphy.gif']
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