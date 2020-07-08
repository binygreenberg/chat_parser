import emojiRegex from 'emoji-regex'
import FlatQueue from "flatqueue";

const stopwordsRegex = /\ba\b|\babout\b|\babove\b|\bafter\b|\bagain\b|\bagainst\b|\ball\b|\bam\b|\ban\b|\band\b|\bany\b|\bare\b|\baren't\b|\bas\b|\bat\b|\bbe\b|\bbecause\b|\bbeen\b|\bbefore\b|\bbeing\b|\bbelow\b|\bbetween\b|\bboth\b|\bbut\b|\bby\b|\bcan't\b|\bcannot\b|\bcould\b|\bcouldn't\b|\bdid\b|\bdidn't\b|\bdo \b|\bdoes\b|\bdoesn't\b|\bdoing\b|\bdon't\b|\bdown\b|\bduring\b|\beach\b|\bfew\b|\bfor\b|\bfrom\b|\bfurther\b|\bhad\b|\bhadn't\b|\bhas\b|\bhasn't\b|\bhave\b|\bhaven't\b|\bhaving\b|\bhe\b|\bhe'd\b|\bhe'll\b|\bhe's\b|\bher\b|\bhere\b|\bhere's\b|\bhers\b|\bherself\b|\bhim\b|\bhimself\b|\bhis\b|\bhow\b|\bhow's\b|\bi\b|\bi'd\b|\bi'll\b|\bi'm\b|\bi've\b|\bif\b|\bin\b|\binto\b|\bis\b|\bisn't\b|\bit\b|\bit's\b|\bits\b|\bitself\b|\blet's\b|\bme\b|\bmore\b|\bmost\b|\bmustn't\b|\bmy\b|\bmyself\b|\bno\b|\bnor\b|\bnot\b|\bof\b|\boff\b|\bon\b|\bonce\b|\bonly\b|\bor\b|\bother\b|\bought\b|\bour\b|\bours,\b|\bour\b|\blves\b|\bout\b|\bover\b|\bown\b|\bsame\b|\bshan't\b|\bshe\b|\bshe'd\b|\bshe'll\b|\bshe's\b|\bshould\b|\bshouldn't\b|\bso\b|\bsome\b|\bsuch\b|\bthan\b|\bthat\b|\bthat's\b|\bthe\b|\btheir\b|\btheirs\b|\bthem\b|\bthemselves\b|\bthen\b|\bthere\b|\bthere's\b|\bthese\b|\bthey\b|\bthey'd\b|\bthey'll\b|\bthey're\b|\bthey've\b|\bthis\b|\bthose\b|\bthrough\b|\bto\b|\btoo\b|\bunder\b|\buntil\b|\bup\b|\bvery\b|\bwas\b|\bwasn't\b|\bwe\b|\bwe'd\b|\bwe'll\b|\bwe're\b|\bwe've\b|\bwere\b|\bweren't\b|\bwhat\b|\bwhat's\b|\bwhen\b|\bwhen's\b|\bwhere\b|\bwhere's\b|\bwhich\b|\bwhile\b|\bwho\b|\bwho's\b|\bwhom\b|\bwhy\b|\bwhy's\b|\bwith\b|\bwon't\b|\bwould\b|\bwouldn't\b|\byou\b|\byou'd\b|\byou'll\b|\byou're\b|\byou've\b|\byour\b|\byours\b|\byourself\b|\byourselves\b|https|http|www/gi
const myEmojiRegex = emojiRegex();
const TOP_X_SIZE = 10;
const PREFIX_CHAT_LINE_REGEX = {
  IPHONE: new RegExp('\\[(\\d+\/\\d+\/\\d\\d+), \\d+:\\d\\d:\\d\\d] (.*?):(.*? omitted)?'),
  ANDROID: new RegExp('(\\d+\/\\d+\/\\d\\d+), \\d+:\\d\\d \\w\\w -(.*?):(.*? omitted>)?')
}
const DATE_FORMATS = {
  "d/M/yyyy": new RegExp('\\d+\/\\d+\/\\d\\d\\d\\d'),
  'M/d/yy': new RegExp('\\d+\/\\d+\/\\d\\d')
}
let CURRENT_PREFIX_CHAT_LINE_REGEX;

function findCorrectRegex(firstLine) {
  const regexKey = Object.keys(PREFIX_CHAT_LINE_REGEX).find(regexType => PREFIX_CHAT_LINE_REGEX[regexType].test(firstLine))
  return PREFIX_CHAT_LINE_REGEX[regexKey];
}

export function analyzeChat(text) {
  let emojiCount = {};
  let wordCloudText = '';
  let usersCount = {};
  let dateCount = {};
  const textArray = text.split('\n');
  const firstLine = textArray[3];
  CURRENT_PREFIX_CHAT_LINE_REGEX = findCorrectRegex(firstLine);
  const title = "";
  textArray.slice(3).forEach(line => {
    wordCloudText = wordCount(line, wordCloudText);
    countEmoji(line, emojiCount);
    countUsers(line, usersCount);
    countDates(line, dateCount);
  });
  const wordCloudTextClean = wordCloudText.replace(stopwordsRegex, '');
  const usersCountArr = Object.entries(usersCount).map(entry => ({ key: entry[0], value: entry[1] }))
  const usersCountSorted = usersCountArr.sort((a, b) => b.value - a.value);
  return {
    title,
    topEmojiCount: getTopXCount(emojiCount),
    usersCount: usersCountSorted,
    dateCount: Object.entries(dateCount).map(entry => ({ date: entry[0], value: entry[1] })),
    wordCloudText: wordCloudTextClean,
  }
}

function wordCount(line, text) {
  const cleanStringLine = line.replace(CURRENT_PREFIX_CHAT_LINE_REGEX, '');
  return text + cleanStringLine;
}

function countEmoji(text, emojiCount) {
  let match;
  while (match = myEmojiRegex.exec(text)) {
    const emoji = match[0];
    emojiCount[emoji] = emojiCount[emoji] ? emojiCount[emoji] + 1 : 1;
  }
  return emojiCount;
}


function countUsers(line, usersCount) {
  const array = CURRENT_PREFIX_CHAT_LINE_REGEX.exec(line);
  if (array && array[2]) {
    usersCount[array[2]] = usersCount[array[2]] ? usersCount[array[2]] + 1 : 1;
  }
}

function countDates(line, dateCount) {
  const array = CURRENT_PREFIX_CHAT_LINE_REGEX.exec(line);
  if (array && array[1]) {
    dateCount[array[1]] = dateCount[array[1]] ? dateCount[array[1]] + 1 : 1;
  }
}

function getTopXCount(emojiCountMap) {
  const queue = new FlatQueue()
  Object.keys(emojiCountMap).forEach(emoji => {
    if (queue.length < TOP_X_SIZE) {
      queue.push(emoji, emojiCountMap[emoji]);
    } else {
      const lowestValueInQueue = queue.peekValue();
      if (lowestValueInQueue < emojiCountMap[emoji]) {
        queue.pop();
        queue.push(emoji, emojiCountMap[emoji]);
      }
    }
  })
  const arr = []
  const length = queue.length;
  for (let i = 0; i < length; i++) {
    const emoji = queue.pop();
    arr.push({ key: emoji, value: emojiCountMap[emoji] }); // push an item by passing its id and value
  }
  return arr;
}

export function getCorrectDateFormat(date) {
  return Object.keys(DATE_FORMATS).find(regexType => DATE_FORMATS[regexType].test(date));
}


