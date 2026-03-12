//Developed by Parthkumar Rathod (Wardragon3399)

chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({
    url: chrome.runtime.getURL("index.html")
  });
});
