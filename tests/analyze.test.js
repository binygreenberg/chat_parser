import assert from 'assert';
import {analyzeChat, getCorrectDateFormat} from "../src/analyze.js";
import fs from 'fs';
import JSZip from "jszip";
import {expected, exepected2} from "./expectedResponse.js";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
describe('Test analyzeChat', () => {
  it('should test zipped test chat', async () => {
    const f = fs.readFileSync(__dirname + "/chats/bigChat.zip");
    const zip = await JSZip.loadAsync(f);
    const chatText = await zip.file("_chat.txt").async("text");
    const analyzedChat = analyzeChat(chatText);
    assert.deepStrictEqual(analyzedChat, expected);
  });
  it('should parse android chat', () => {
    const chatText = fs.readFileSync(__dirname + "/chats/android_group_v1").toString('utf8');
    const analyzedChat = analyzeChat(chatText);
    assert.deepStrictEqual(analyzedChat, exepected2);
  });
  it('should parse iphone chat', () => {
    const chatText = fs.readFileSync(__dirname + "/chats/iphone_single_v2").toString('utf8');
    const analyzedChat = analyzeChat(chatText);
    assert.deepStrictEqual(analyzedChat, exepected2);
  })
  it('should get correct date format for android', () => {
    const chatText = fs.readFileSync(__dirname + "/chats/android_group_v1").toString('utf8');
    const analyzedChat = analyzeChat(chatText);
    const dateFormat = getCorrectDateFormat(analyzedChat.dateCount[0].date)
    assert.deepStrictEqual(dateFormat, 'M/d/yy');
  })
  it('should get correct date format for iphone', () => {
    const chatText = fs.readFileSync(__dirname + "/chats/iphone_group_v1").toString('utf8');
    const analyzedChat = analyzeChat(chatText);
    const dateFormat = getCorrectDateFormat(analyzedChat.dateCount[0].date)
    assert.deepStrictEqual(dateFormat, 'd/M/yyyy');
  })
});
