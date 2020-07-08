import assert from 'assert';
import {analyzeChat} from "./analyze.js";
import fs from 'fs';
import JSZip from "jszip";
import {getCorrectDateFormat} from "./analyze.js";
import pkg from 'mocha';
const {describe} = pkg;

const expected = {
  "title": "The Boys",
  "topEmojiCount": [
    {
      "key": "😘",
      "value": 1
    },
    {
      "key": "😍",
      "value": 1
    },
    {
      "key": "🎊",
      "value": 10
    },
    {
      "key": "🥳",
      "value": 12
    },
    {
      "key": "🎉",
      "value": 15
    }
  ],
  "usersCount": [
    {
      "key": "דב",
      "value": 3
    },
    {
      "key": "קופי",
      "value": 3
    },
    {
      "key": "sammy‬",
      "value": 7
    },
    {
      "key": "johny‬",
      "value": 4
    },
    {
      "key": "Binyamin",
      "value": 3
    }
  ],
  "wordCloudText": "\r מזל טוב!!!!!🎊🎊🎊🎊🎊🎊🎊🎊🎉🎉🎉🎉🎉\r מזלללל\r Who are you engaged to?? When’s the wedding ??\r 🥳🥳🥳🥳🎉🎉🎊🎊\r Wooooo 🎉🎉🎉🎉🎉\r Wuhuuuu!!!!\r Perfect way to bring in the new year mazal tov\r Mazal tov Dov!🥳🥳❤\r Totally\r Thanks guys\r Mazal tov!!! 😘🥳🥳🥳\r‎\r מזל טוב!!!!\r 🥳\r 🎉🎉🎉\r‎\r מזל טוב!\r Mazal Tov!!\r 🥳🥳😍\r‎"
}
describe('Test analyzeChat', () => {
  it('emoji test')
  it('should test zipped test chat', async () => {
    const f = fs.readFileSync("/Users/binyamingreenberg/zipparser/chat.zip");
    const zip = await JSZip.loadAsync(f);
    const chatText = await zip.file("_chat.txt").async("text");
    const analyzedChat = analyzeChat(chatText);
    console.log(analyzedChat);
    assert.deepStrictEqual(analyzedChat, expected);
  });
  it('should parse android chat', () => {
    const chatText = fs.readFileSync("/Users/binyamingreenberg/Downloads/android_whatsapp.txt").toString('utf8');
    const analyzedChat = analyzeChat(chatText);
    console.log(analyzedChat);
  });
  it('should get correct date format for android', () =>{
    const chatText = fs.readFileSync("/Users/binyamingreenberg/zipparser/test_chats/android_group_v1").toString('utf8');
    const analyzedChat = analyzeChat(chatText);
    const dateFormat = getCorrectDateFormat(analyzedChat.dateCount[0].date)
    assert.deepStrictEqual(dateFormat, 'M/d/yy');
  })
  it('should get correct date format for iphone', () =>{
    const chatText = fs.readFileSync("/Users/binyamingreenberg/zipparser/test_chats/iphone_group_v1").toString('utf8');
    const analyzedChat = analyzeChat(chatText);
    const dateFormat = getCorrectDateFormat(analyzedChat.dateCount[0].date)
    assert.deepStrictEqual(dateFormat, 'd/M/yyyy');
  })
});
