'use strict';

// import dotenv from 'dotenv';
require('dotenv').config();
const express = require('express');
const line = require('@line/bot-sdk');
const PORT = 3000;
const axios = require('axios')

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

// nodeのversionを取ってくる
const getNodeVer = async(userId) => {
  const res = await axios.get('https://nodejs.org/ja/');
  const item = res.data;
  const version = item.match(/最新版"  data-version="(.*?)">/)[1];
  await client.pushMessage(userId, {
    type: 'text',
    text: `今の最新は${version}だよ`
  });
}

// async function getweather(userId) {
//   const res = await axios.get('http://abehiroshi.la.coocan.jp/');
//   const item = res.data;
//   let str = '';
//   for (let i = 0; i < item.length; i++) {
//     str = str + item[i];
//   }
//   await client.pushMessage(userId, {
//     type: 'text',
//     text: `取ってきた値${str}`
//   });
// }

const getWeather = async(userId) => {
  const res = await axios.get('http://abehiroshi.la.coocan.jp/');
  const item = res.data;
  let str = '';
  for (let i = 0; i < item.length; i++) {
    str = str + item[i];
  }
  await client.pushMessage(userId, {
    type: 'text',
    text: `取ってきた値${str}`
  });
}

async function handleEvent(event) {
  try {
    if (event.type !== 'message') {
      return Promise.resolve(null);
    }
    if (event.message.type === 'image') {
      return client.replyMessage(event.replyToken, {
        type: 'text',
        text: '画像を送らないで！'
      })
    } else if (event.message.type === 'text' && event.message.text === 'node'){
      let mes = 'ちょっと待ってね';
      getNodeVer(event.source.userId);
      return client.replyMessage(event.replyToken, {
        type: 'text',
        text: mes
      });
    } else if (event.message.type === 'text' && event.message.text === '天気') {
      let mes = 'ちょっと待ってよ';
      getWeather(event.source.userId);
      // getweather(event.source.userId);
      return client.replyMessage(event.replyToken, {
        type: 'text',
        text: mes
      });
      // try {
      //   const res = await axios.get('https://www.google.com/');
      //   const json = res.data;
      //   return client.replyMessage(event.replyToken, {
      //         type: 'text',
      //         text: json
      //       })
      // } catch(err) {
      //   console.log(err)
      // }
      // axios({
      //   "method":"GET",
      //   "url":"https://dark-sky.p.rapidapi.com/%7Blatitude%7D,%7Blongitude%7D",
      //   "headers":{
      //   "content-type":"application/octet-stream",
      //   "x-rapidapi-host":"dark-sky.p.rapidapi.com",
      //   "x-rapidapi-key": "",
      //   "useQueryString":true
      //   },"params":{
      //   "lang":"ja",
      //   "units":"auto"
      //   }
      // })
      // axios({
      //   "method":"GET",
      //   "url":"https://community-open-weather-map.p.rapidapi.com/weather",
      //   "headers":{
      //   "content-type":"application/octet-stream",
      //   "x-rapidapi-host":"community-open-weather-map.p.rapidapi.com",
      //   "x-rapidapi-key":"",
      //   "useQueryString":true
      //   },"params":{
      //   "q":"London%2Cuk",
      //   }
      // })
      // .then((res) => {
      //   return client.replyMessage(event.replyToken, {
      //     type: 'text',
      //     text: res
      //   })
      // })
      // .catch((err) => {
      //   console.log(err)
      // })
    } else if (event.message.type === 'text' && event.message.text === 'おすすめコーヒー'){
      return client.replyMessage(event.replyToken, {
        type: 'flex',
        altText: 'おすすめコーヒー',
        contents:
        {
            "type": "bubble",
            "hero": {
              "type": "image",
              "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/01_1_cafe.png",
              "size": "full",
              "aspectRatio": "20:13",
              "aspectMode": "cover",
              "action": {
                "type": "uri",
                "uri": "http://linecorp.com/"
              }
            },
            "body": {
              "type": "box",
              "layout": "vertical",
              "contents": [
                {
                  "type": "text",
                  "text": "Brown Cafe",
                  "weight": "bold",
                  "size": "xl"
                },
                {
                  "type": "box",
                  "layout": "baseline",
                  "margin": "md",
                  "contents": [
                    {
                      "type": "icon",
                      "size": "sm",
                      "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png"
                    },
                    {
                      "type": "icon",
                      "size": "sm",
                      "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png"
                    },
                    {
                      "type": "icon",
                      "size": "sm",
                      "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png"
                    },
                    {
                      "type": "icon",
                      "size": "sm",
                      "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png"
                    },
                    {
                      "type": "icon",
                      "size": "sm",
                      "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gray_star_28.png"
                    },
                    {
                      "type": "text",
                      "text": "4.0",
                      "size": "sm",
                      "color": "#999999",
                      "margin": "md",
                      "flex": 0
                    }
                  ]
                },
                {
                  "type": "box",
                  "layout": "vertical",
                  "margin": "lg",
                  "spacing": "sm",
                  "contents": [
                    {
                      "type": "box",
                      "layout": "baseline",
                      "spacing": "sm",
                      "contents": [
                        {
                          "type": "text",
                          "text": "Place",
                          "color": "#aaaaaa",
                          "size": "sm",
                          "flex": 1
                        },
                        {
                          "type": "text",
                          "text": "Miraina Tower, 4-1-6 Shinjuku, Tokyo",
                          "wrap": true,
                          "color": "#666666",
                          "size": "sm",
                          "flex": 5
                        }
                      ]
                    },
                    {
                      "type": "box",
                      "layout": "baseline",
                      "spacing": "sm",
                      "contents": [
                        {
                          "type": "text",
                          "text": "Time",
                          "color": "#aaaaaa",
                          "size": "sm",
                          "flex": 1
                        },
                        {
                          "type": "text",
                          "text": "10:00 - 23:00",
                          "wrap": true,
                          "color": "#666666",
                          "size": "sm",
                          "flex": 5
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            "footer": {
              "type": "box",
              "layout": "vertical",
              "spacing": "sm",
              "contents": [
                {
                  "type": "button",
                  "style": "link",
                  "height": "sm",
                  "action": {
                    "type": "uri",
                    "label": "CALL",
                    "uri": "https://linecorp.com"
                  }
                },
                {
                  "type": "button",
                  "style": "link",
                  "height": "sm",
                  "action": {
                    "type": "uri",
                    "label": "WEBSITE",
                    "uri": "https://linecorp.com"
                  }
                },
                {
                  "type": "spacer",
                  "size": "sm"
                }
              ],
              "flex": 0
            }
          }
      })
    } else {
      return client.replyMessage(event.replyToken, {
        type: 'text',
        text: event.message.text //実際に返信の言葉を入れる箇所→ここではオウム返し
      });
    }
  } catch(err) {
    console.error(err)
  }
}

// app.listen(PORT);
// console.log(`Server running at ${PORT}`);
(process.env.NOW_REGION) ? module.exports = app : app.listen(PORT);
console.log(`Server running at ${PORT}`);

