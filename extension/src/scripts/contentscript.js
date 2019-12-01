import ext from "./utils/ext";


const fetchData = (url) => {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open( "GET", 'https://api.fakenewsdetector.org/votes?url='+url+'&title=', false );
  xmlHttp.send( null );
  return JSON.parse(xmlHttp.responseText);
}

var getData = () => {
  var url = document.location.href;
  if(!url || !url.match(/^http/)) return;
  const apiData = fetchData(url);
  var data = {};
  data["fake_news"] = parseInt(apiData.robot.fake_news * 100);
  data["biased"] = parseInt(apiData.robot.extremely_biased * 100);
  data["clickbait"] = parseInt(apiData.robot.clickbait * 100);
  data["keywords"] = "";
  apiData.keywords.forEach((keyword, i) => data["keywords"] += `<a href="https://www.google.com/search?q=${keyword}" style="text-decoration: none;">${keyword}</a> `);
  return data;
}

function onRequest(request, sender, sendResponse) {
  if (request.action === 'process-page') {
    sendResponse(getData());
  }
}

ext.runtime.onMessage.addListener(onRequest);