chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    Snakey.log('Recieved message', { request, sender });
    if (window !== window.top) return;
    let data = request.data;
    switch (request.action) {
      case 11:
        ContentSnakey.Queue.pass(ContentSnakey.loadStyleBunch, Util.flattenStyle(data.style));
        break;
      case 12:
        ContentSnakey.Queue.pass(ContentSnakey.removeStyle, data.id);
        break;
      case 13:
        ContentSnakey.Queue.pass(ContentSnakey.removeStyle, data.id);
        if(!data.style.active) return;
        ContentSnakey.Queue.pass(ContentSnakey.loadStyleBunch, Util.flattenStyle(data.style));
        break;
      case 14:
        ContentSnakey.refreshStyleSettings(data.id);
        break;
    }
    sendResponse({});
});