import JSZip from "jszip";
import $ from 'jquery';
import {createChart as createBarChart} from './charts/barChart'
import {createChart as createPieChart} from './charts/pieChart'
import {createChart as createWordCloud} from './charts/wordCloud'
import {createChart as createLineChart} from './charts/timelineChart'
import * as am4core from "@amcharts/amcharts4/core";
import {analyzeChat} from './analyze.js'
import {getCorrectDateFormat} from "./analyze";

const CHATS_ENDPOINT = 'https://dwirm9cy83.execute-api.us-east-1.amazonaws.com/Staging/chats'

const urlArr = window.location.href.split('/');
if (urlArr[urlArr.length - 2] === 'chats') {
  const analyzedChatFunc = async () => {
    try {
      const response = await fetch(`${CHATS_ENDPOINT}/${urlArr[urlArr.length - 1]}`);
      return response.json()
    } catch (e) {
      throw e
    }
  }
  loadCharts(analyzedChatFunc).then(r => console.log(r));
}

$("#file").on("change", function(evt) {
  // be sure to show the results
  const files = evt.target.files;
  const analyzedChatFunc = async () => {
    const text = await handleFile(files[0]);
    const analyzedChat = analyzeChat(text);
    return analyzedChat;
  }
  loadCharts(analyzedChatFunc).then(r => console.log(r));
});

async function loadCharts(analyzedChatFunc) {
  try {
    $("#fileupload_block").removeClass("show").addClass("hidden");
    $("#loader").removeClass("hidden").addClass("show");
    const analyzedChat = await analyzedChatFunc();
    window.globalChat = analyzedChat;
    am4core.options.queue = true;
    createWordCloud(analyzedChat.wordCount);
    createBarChart(analyzedChat.emojiCount);
    createPieChart(analyzedChat.userCount);
    createLineChart(analyzedChat.dateCount, getCorrectDateFormat(analyzedChat.dateCount[0].key));
    setTimeout(() => {
      $("#loader").removeClass("show").addClass("hidden");
      $("#result_block").removeClass("hidden").addClass("show");
    }, 100);
  } catch (e) {
    $("#loader").removeClass("show").addClass("hidden");
    $("#error").removeClass("hidden").addClass("show");
    console.log(e);
  }
}

$("#shareButton").on("click", async function(evt) {
  const uploadId = await uploadChat();
  $("#shareLinkInput").val(`${window.location}chats/${uploadId}`)
});

$("#copyLinkButton").on("click", function(evt) {
  /* Get the text field */
  const inputElem = $("#shareLinkInput");
  inputElem.select();

  /* Copy the text inside the text field */
  document.execCommand("copy");

  /* Alert the copied text */
  alert("Copied the text: " + inputElem.val());
});

async function uploadChat (){
  try {
    const response = await fetch(`${CHATS_ENDPOINT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(window.globalChat)
    });
    console.log(response.json().id())
    return response.json().id()
  } catch (e) {
    throw e
  }
}

// Closure to capture the file information.
async function handleFile(f) {
  const zip = await JSZip.loadAsync(f);
  const chatText = await zip.file("_chat.txt").async("text");
  return chatText;
}
