import JSZip from "jszip";
import $ from 'jquery';
import {createChart as createBarChart} from './charts/barChart'
import {createChart as createPieChart} from './charts/pieChart'
import {createChart as createWordCloud} from './charts/wordCloud'
import {createChart as createLineChart} from './charts/timelineChart'
import {analyzeChat} from './analyze.js'
import {getCorrectDateFormat} from "./analyze";

$("#file").on("change", async function(evt) {
  // be sure to show the results
  const files = evt.target.files;
  try {
    $("#fileupload_block").removeClass("show").addClass("hidden");
    $("#loader").removeClass("hidden").addClass("show");
    const text = await handleFile(files[0]);
    const analyzedChat = analyzeChat(text);
    createWordCloud(analyzedChat.wordCloudText);
    createBarChart(analyzedChat.topEmojiCount);
    createPieChart(analyzedChat.usersCount);
    createLineChart(analyzedChat.dateCount, getCorrectDateFormat(analyzedChat.dateCount[0].date));
    setTimeout(()=>{
      $("#loader").removeClass("show").addClass("hidden");
      $("#result_block").removeClass("hidden").addClass("show");
    },100);
  } catch (e) {
    $("#loader").removeClass("show").addClass("hidden");
    $("#error").removeClass("hidden").addClass("show");
    console.log(e);
  }
});

// Closure to capture the file information.
async function handleFile(f) {
  const zip = await JSZip.loadAsync(f);
  const chatText = await zip.file("_chat.txt").async("text");
  return chatText;
}
