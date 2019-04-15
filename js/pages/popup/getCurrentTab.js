getCurrentTab = window.getCurrentTab = function(){
  return new Promise(function (resolve) {
    chrome.tabs.query({
        active: true,
        currentWindow: true
      }, function(tabs) {
      var currentTab = tabs[0];
      resolve(currentTab);
    });
  });
}