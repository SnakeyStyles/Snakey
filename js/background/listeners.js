chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    BackgroundSnakey.onMessage(request, sender, sendResponse);
    return true;
});

BackgroundSnakey.onMessage = async function(request, sender, sendResponse) {
  console.log('Recieved message', { request, sender });
  let data = request.data;
  let respond = data => {
    if(request.requestID)
      BackgroundSnakey.emitter.send(sender.tab.id, 1000, data, sender, request.requestID);
      else sendResponse(data);
  }
  switch (request.action) {
    case 15:
      respond(await Snakey.styles.add({ styleObject: data.style, url: data.url }));
      BackgroundSnakey.updateTabs();
      break;
    case 16:
      respond(await Snakey.styles.remove(data.id));
      BackgroundSnakey.updateTabs();
      break;
    case 17:
      await Snakey.storage.updateStyle(data.id, data.style);
      BackgroundSnakey.emitter.sendToAll(13, data, sender);
      BackgroundSnakey.updateTabs();
      respond({ data });
      break;
    case 18:
      await Snakey.storage.setStyleSetting(data.id, data.key, data.value);
      BackgroundSnakey.emitter.sendToAll(14, data, sender);
      respond({ data });
      break;
    case 28:
      await Snakey.storage.setSetting(data.key, data.value);
      if(data.key === "redirect_links") BackgroundSnakey.redirectLinks = data.value;
      BackgroundSnakey.emitter.sendToAll(28, data, sender);
      respond({ data });
      break;
    case 1001:
      respond(await Snakey.styles.add({ styleObject: data.style, url: data.url, dry: true }));
      break;
    case 1002:
      chrome.tabs.remove(sender.tab.id);
      respond(chrome.tabs.create({ url: data.url }));
      break;
  }
}

// Tab Icons

BackgroundSnakey.updateTabs = async function() {
  let tabs = await Snakey.tabs.getAll();
  tabs.map(t => Snakey.tabs.updateIcon(t))
}

BackgroundSnakey.updateTabs();

chrome.tabs.onUpdated.addListener(async function(ti, c) {
  let tab = c.url ? c : await Snakey.tabs.get(ti);
  if(!tab) return;
	Snakey.tabs.updateIcon({ url: tab.url, id: ti });
});

chrome.tabs.onCreated.addListener(Snakey.tabs.updateIcon);

// Web Request

chrome.webRequest.onBeforeRequest.addListener(function(info) {
  if(!BackgroundSnakey.redirectLinks || info.method !== "GET") return;
  if(info.initiator && info.initiator.startsWith("chrome")) return;
  let url = new URL(info.url);

  // Special Website Exclusions
  if(url.hostname === "github.com" && url.pathname.split("/")[2] !== "raw") return;
  if(url.hostname === "code.google.com") return;
  if(url.searchParams.get('ignore_snakey') === "1") return;

  if(url.pathname.endsWith('.snakey') || url.pathname.endsWith('.snakey.json')) {
    let redirectURL = new URL(chrome.extension.getURL('pages/ask.html'));
    redirectURL.searchParams.append("url", info.url);
    redirectURL.searchParams.append("requestId", info.requestId);
    console.log("Detected script", { url, info, redirectURL, href: redirectURL.href });
    return { redirectUrl: redirectURL.href };
  };
  return;
}, { urls: [ "http://*/*", "https://*/*" ] }, ['blocking']);