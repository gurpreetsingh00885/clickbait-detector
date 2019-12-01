import ext from "./utils/ext";
import storage from "./utils/storage";

var popup = document.getElementById("app");
storage.get('color', function(resp) {
  var color = resp.color;
  if(color) {
    popup.style.backgroundColor = color
  }
});

var template = (data) => {
  var json = JSON.stringify(data);
  return (`
  <div style="width: 100%;">
      <b>Fake</b>
      <div class="progress" style="height: 25px;">
        <div class="progress-bar" role="progressbar" aria-valuenow="${data.fake_news}"
  aria-valuemin="0" aria-valuemax="100" style="width:${data.fake_news}%">
        ${data.fake_news}%
        </div>
      </div>
      <br/>
      <b>Extremely Biased</b>
      <div class="progress" style="height: 25px;">
        <div class="progress-bar" role="progressbar" aria-valuenow="${data.biased}"
  aria-valuemin="0" aria-valuemax="100" style="width:${data.biased}%">
        ${data.biased}%
        </div>
      </div>
      <br/>
      <b>Clickbait</b>
      <div class="progress" style="height: 25px;">
        <div class="progress-bar" role="progressbar" aria-valuenow="${data.clickbait}"
  aria-valuemin="0" aria-valuemax="100" style="width:${data.clickbait}%">
        ${data.clickbait}%
        </div>
      </div>
      <hr/>
      <b>Keywords</b> <br/><br/>
      ${data.keywords}
  </div>
  `);
}
var renderMessage = (message) => {
  var displayContainer = document.getElementById("display-container");
  displayContainer.innerHTML = `<p class='message'>${message}</p>`;
}

var renderResult = (data) => {
  var displayContainer = document.getElementById("display-container")
  if(data) {
    var tmpl = template(data);
    displayContainer.innerHTML = tmpl;
  } else {
    renderMessage("Sorry, this page doesn't look like news to me.")
  }
}

ext.tabs.query({active: true, currentWindow: true}, function(tabs) {
  var activeTab = tabs[0];
  chrome.tabs.sendMessage(activeTab.id, { action: 'process-page' }, renderResult);
});

popup.addEventListener("click", function(e) {
  if(e.target && e.target.matches("#save-btn")) {
    e.preventDefault();
    var data = e.target.getAttribute("data-bookmark");
    ext.runtime.sendMessage({ action: "perform-save", data: data }, function(response) {
      if(response && response.action === "saved") {
        renderMessage("Your bookmark was saved successfully!");
      } else {
        renderMessage("Sorry, there was an error while saving your bookmark.");
      }
    })
  }
});

var optionsLink = document.querySelector(".js-options");
optionsLink.addEventListener("click", function(e) {
  e.preventDefault();
  ext.tabs.create({'url': ext.extension.getURL('options.html')});
})
