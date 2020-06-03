import assert from 'assert';
import {analyzeChat} from "./analyze.js";
import fs from 'fs';
import JSZip from "jszip";
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
      "value": 4
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
  "wordCloudText": "‎"
}
describe('Test analyzeChat', function() {
  let chatText = ''
  before(async () => {
      // const f = fs.readFileSync(__dirname + "../../chat.zip");
      const f = fs.readFileSync("/Users/binyamingreenberg/Downloads/whatsappima.zip");
      const zip = await JSZip.loadAsync(f);
      chatText = await zip.file("_chat.txt").async("text");
    }
  )
  it('should test analyzeChat', function() {
    const analyzedChat = analyzeChat(chatText);
    console.log(analyzedChat);
    assert.deepStrictEqual(analyzedChat, expected);
  });
});
