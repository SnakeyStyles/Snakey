// Since there is a bug with chrome sending empty responses
// when it takes too long, here is a solution.

let PromisedRequest = {
  callbacks: {},
  send(action, data) {
    return new Promise(respond => {
      let requestID = Date.now().toString(36);
      let timer = setTimeout(function() {
        respond({
          ok: false,
          errorName: 'REQUEST_TIMEOUT',
          messageText: 'Request timed out',
          data: {}
        })
      }, 60000);
      PromisedRequest.callbacks[requestID] = response => {
        clearTimeout(timer);
        respond(response.data);
      };
      Snakey.sendToBackground(action, data, requestID);
	  });
  }
}

chrome.runtime.onMessage.addListener(
  function(request) {
    if(window !== window.top) return;
    if(request.requestID && PromisedRequest.callbacks[request.requestID])
      PromisedRequest.callbacks[request.requestID](request);
});