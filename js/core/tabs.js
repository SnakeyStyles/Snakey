Snakey.tabs = {};

Snakey.tabs.updateIcon = async function(tab) {
  if(Snakey.tabs.urlSupported(tab.url)){
    let styles = await Snakey.styles.getAllInURL(tab.url);
    let isActive = false;
    Util.objectForEach(styles, (_, v) => {
      if(v.active && v.style_type === "style") isActive = true;
    });
    if(!Util.isEmpty(styles)) 
      chrome.browserAction.setIcon({
        tabId: tab.id,
        path: `icon/${isActive ? 'active' : 'ready'}.png`
      });
  } else chrome.browserAction.setIcon({
    tabId: tab.id,
    path: "icon/disabled.png"
  });
}

Snakey.tabs.get = function(id) {
  return Util.promisifyCallback(chrome.tabs.get, id);
}

Snakey.tabs.urlSupported = function(url) {
  return !Object.keys(Constants.UnsupportedProtocols).filter(p => url.startsWith(p)).length;
}

Snakey.tabs.simplifyURL = function(url) {
  let matchedProtos = Object.keys(Constants.UnsupportedProtocols).filter(p => url.startsWith(p));
  if(matchedProtos.length)
    return i18n(Constants.UnsupportedProtocols[matchedProtos[0]]);
  return url.match(Constants.URLRegex)[2];
}

Snakey.tabs.send = function(id, action, data) {
  return BackgroundSnakey.emitter.send(id, action, data);
}

Snakey.tabs.getAll = function() {
  return new Promise((resolve) => {
    chrome.tabs.query({}, resolve);
  });
}