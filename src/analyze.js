import emojiRegex from 'emoji-regex'
import FlatQueue from "flatqueue";

const stopWordsSet = new Set([  "a",  "about",  "above",  "after",  "again",  "against",  "all",  "am",  "an",  "and",  "any",  "are",  "aren’t",  "as",  "at",  "be",  "because",  "been",  "before",  "being",  "below",  "between",  "both",  "but",  "by",  "can’t",  "cannot",  "could",  "couldn’t",  "did",  "didn’t",  "do",  "does",  "doesn’t",  "doing",  "don’t",  "down",  "during",  "each",  "few",  "for",  "from",  "further",  "had",  "hadn’t",  "has",  "hasn’t",  "have",  "haven’t",  "having",  "he",  "he’d",  "he’ll",  "he’s",  "her",  "here",  "here’s",  "hers",  "herself",  "him",  "himself",  "his",  "how",  "how’s",  "i",  "i’d",  "i’ll",  "i’m",  "i’ve",  "if",  "in",  "into",  "is",  "isn’t",  "it",  "it’s",  "its",  "itself",  "let’s",  "me",  "more",  "most",  "mustn’t",  "my",  "myself",  "no",  "nor",  "not",  "of",  "off",  "on",  "once",  "only",  "or",  "other",  "ought",  "our",  "ours",  "ourselves",  "out",  "over",  "own",  "same",  "shan’t",  "she",  "she’d",  "she’ll",  "she’s",  "should",  "shouldn’t",  "so",  "some",  "such",  "than",  "that",  "that’s",  "the",  "their",  "theirs",  "them",  "themselves",  "then",  "there",  "there’s",  "these",  "they",  "they’d",  "they’ll",  "they’re",  "they’ve",  "this",  "those",  "through",  "to",  "too",  "u",  "under",  "until",  "up",  "very",  "was",  "wasn’t",  "we",  "we’d",  "we’ll",  "we’re",  "we’ve",  "were",  "weren’t",  "what",  "what’s",  "when",  "when’s",  "where",  "where’s",  "which",  "while",  "who",  "who’s",  "whom",  "why",  "why’s",  "with",  "won’t",  "would",  "wouldn’t",  "you",  "you’d",  "you’ll",  "you’re",  "you’ve",  "your",  "yours",  "yourself",  "yourselves",  "https",  "http",  "com",  "aren't",  "can't",  "couldn't",  "didn't",  "doesn't",  "don't",  "hadn't",  "hasn't",  "haven't",  "he'd",  "he'll",  "he's",  "here's",  "how's",  "i'd",  "i'll",  "i'm",  "i've",  "isn't",  "it's",  "let's",  "mustn't",  "shan't",  "she'd",  "she'll",  "she's",  "shouldn't",  "that's",  "there's",  "they'd",  "they'll",  "they're",  "they've",  "wasn't",  "we'd",  "we'll",  "we're",  "we've",  "weren't",  "what's",  "when's",  "where's",  "who's",  "why's",  "won't",  "wouldn't",  "you'd",  "you'll",  "you're",  "you've"])
const stopWordsHebrew = new Set();

const myEmojiRegex = emojiRegex();
const myAllWordsRegex = /[A-Za-z'’\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+/g

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
  let wordCount = {};
  let userCount = {};
  let dateCount = {};
  const textArray = text.split('\n');
  const firstLine = textArray[3];
  CURRENT_PREFIX_CHAT_LINE_REGEX = findCorrectRegex(firstLine);
  const title = "";
  textArray.slice(3).forEach(line => {
    countWords(line, wordCount);
    countEmoji(line, emojiCount);
    countUsers(line, userCount);
    countDates(line, dateCount);
  });
  const usersCountArr = Object.entries(userCount).map(entry => ({ key: entry[0], value: entry[1] }))
  const usersCountSorted = usersCountArr.sort((a, b) => b.value - a.value);
  return {
    title,
    emojiCount: getTopXCount(emojiCount, 10),
    userCount: usersCountSorted,
    dateCount: Object.entries(dateCount).map(entry => ({ key: entry[0], value: entry[1] })),
    wordCount: getTopXCount(wordCount, 120),
  }
}

function countWords(line, wordCount) {
  const lineNoPrefix = line.replace(CURRENT_PREFIX_CHAT_LINE_REGEX, '');
  let match;
  while (match = myAllWordsRegex.exec(lineNoPrefix)) {
    const word = match[0];
    const wordLowerCase = word.toLowerCase();
    if (!stopWordsSet.has(wordLowerCase)) {
      wordCount[wordLowerCase] = wordCount[wordLowerCase] ? wordCount[wordLowerCase] + 1 : 1;
    }
  }
}

function countEmoji(text, emojiCount) {
  let match;
  while (match = myEmojiRegex.exec(text)) {
    const emoji = match[0];
    emojiCount[emoji] = emojiCount[emoji] ? emojiCount[emoji] + 1 : 1;
  }
}

function countUsers(line, userCount) {
  const array = CURRENT_PREFIX_CHAT_LINE_REGEX.exec(line);
  if (array && array[2]) {
    userCount[array[2]] = userCount[array[2]] ? userCount[array[2]] + 1 : 1;
  }
}

function countDates(line, dateCount) {
  const array = CURRENT_PREFIX_CHAT_LINE_REGEX.exec(line);
  if (array && array[1]) {
    dateCount[array[1]] = dateCount[array[1]] ? dateCount[array[1]] + 1 : 1;
  }
}

function getTopXCount(itemCountMap, size) {
  const queue = new FlatQueue()
  Object.keys(itemCountMap).forEach(item => {
    if (queue.length < size) {
      queue.push(item, itemCountMap[item]);
    } else {
      const lowestValueInQueue = queue.peekValue();
      if (lowestValueInQueue < itemCountMap[item]) {
        queue.pop();
        queue.push(item, itemCountMap[item]);
      }
    }
  })
  const arr = []
  const length = queue.length;
  for (let i = 0; i < length; i++) {
    const item = queue.pop();
    arr.push({ key: item, value: itemCountMap[item] }); // push an item by passing its id and value
  }
  return arr;
}

export function getCorrectDateFormat(date) {
  return Object.keys(DATE_FORMATS).find(regexType => DATE_FORMATS[regexType].test(date));
}


