let Snakey = {
  get browser() {
    if(navigator.userAgent.includes('Chrome/')) return 'chrome';
    if(navigator.userAgent.includes('Firefox/')) return 'firefox';
  }
};

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
  return Snakey.base.runtime.sendMessage({ action, data, requestID });
}

Snakey.sendToBackgroundWithResponse = function(action, data) {
  return new Promise((resolve) => {
    Snakey.base.runtime.sendMessage({ action, data }, resolve);
  });
}

Snakey.base = Snakey.browser === 'chrome' ? window.chrome : window.browser;

let i18n = window.i18n = Snakey.base.i18n.getMessage;