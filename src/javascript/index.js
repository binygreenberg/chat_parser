import JSZip from "jszip";
import $ from 'jquery';
import {createChart as createBarChart} from './charts/barChart'
import {createChart as createPieChart} from './charts/pieChart'
import {createChart as createWordCloud} from './charts/wordCloud'
import {analyzeChat} from './analyze.js'

$("#file").on("change", async function(evt) {
  // be sure to show the results
  const files = evt.target.files;
  try {
    const text = await handleFile(files[0]);
    const analyzedChat = analyzeChat(text);
    createWordCloud(analyzedChat.wordCloudText);
    createBarChart(analyzedChat.topEmojiCount);
    createPieChart(analyzedChat.usersCount);
    $("#result_block").removeClass("hidden").addClass("show");
  } catch (e) {
    console.log(e);
  }
});

// Closure to capture the file information.
async function handleFile(f) {
  const zip = await JSZip.loadAsync(f);
  const chatText = await zip.file("_chat.txt").async("text");
  return chatText;
}
