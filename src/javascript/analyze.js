import emojiRegex from 'emoji-regex'
import FlatQueue from "flatqueue";

const myEmojiRegex = emojiRegex();
const TOP_X_SIZE = 10;
const chatLineRegex = new RegExp('\\[\\d\\d\\/\\d\\d\\/\\d\\d\\d\\d, \\d+:\\d\\d:\\d\\d\\] (.*?):(.*? omitted)?');

export function analyzeChat(text) {
  let emojiCount = {};
  let wordCloudText = '';
  let usersCount = {};
  const textArray = text.split('\n');
  const title = chatLineRegex.exec(textArray[0])[1];
  textArray.slice(3).forEach(line => {
    wordCloudText = wordCount(line, wordCloudText);
    countEmoji(line, emojiCount);
    countUsers(line, usersCount);
  });
  return {
    title,
    topEmojiCount: getTopXCount(emojiCount),
    usersCount: Object.entries(usersCount).map(entry => ({ key: entry[0], value: entry[1] })),
    wordCloudText,
  }
}

function wordCount(line, text) {
  const cleanStringLine = line.replace(chatLineRegex, '');
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
  const array = chatLineRegex.exec(line);
  if (array && array[1]) {
    usersCount[array[1]] = usersCount[array[1]] ? usersCount[array[1]] + 1 : 1;
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
