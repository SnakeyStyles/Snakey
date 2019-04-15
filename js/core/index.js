let Snakey = {};

Snakey.log = function(...a) {
  console.log(`%c[Snakey]`, `color: #fbd333; font-weight: bold; `, ...a)
}

Snakey.debug = function(...a) {
  // TODO: read debug setting
  console.debug(`%c[Snakey]`, `color: #fbd333; font-weight: bold; `, ...a)
}

Snakey.error = function(...a) {
  console.error(`%c[Snakey]`, `color: #fbd333; font-weight: bold; `, ...a)
}

Snakey.warn = function(...a) {
  console.warn(`%c[Snakey]`, `color: #fbd333; font-weight: bold; `, ...a)
}

Snakey.sendToBackground = function(action, data, requestID = null) {
  return chrome.runtime.sendMessage({ action, data, requestID });
}

Snakey.sendToBackgroundWithResponse = function(action, data) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ action, data }, resolve);
  });
}

let i18n = window.i18n = chrome.i18n.getMessage;