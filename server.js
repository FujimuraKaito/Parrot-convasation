'use strict';

const express = require('express');
const line = require('@line/bot-sdk');
const PORT = 3000;

const config = {
    channelSecret: '1a21fb0095bb1c7c1b84cb47c5bafdf6',
    channelAccessToken: 'WpwxVLl14LET3RL4iRtNgCjdnBq8E9twkbnDYnR49Zn3YwWlJKuwFtmLbS87jZ3ulxshzI1oBNTOabzLWvnbxjjaKIBB3juXe0PzYRSpz8qarNV+9SowMSe9APr8301MJIKFKBx/aciu1KokTdbEwgdB04t89/1O/w1cDnyilFU='
};

const app = express();

app.get('/', (req, res) => res.send('Hello LINE BOT!(GET)')); //ブラウザ確認用(無くても問題ない)
app.post('/webhook', line.middleware(config), (req, res) => {
    console.log(req.body.events);

    Promise
      .all(req.body.events.map(handleEvent))
      .then((result) => res.json(result));
});

const client = new line.Client(config);

async function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: event.message.text //実際に返信の言葉を入れる箇所
  });
}

app.listen(PORT);
console.log(`Server running at ${PORT}`);