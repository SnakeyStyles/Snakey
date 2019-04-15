chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    Snakey.log('Recieved message', { request, sender });
    if (window !== window.top) return;
    let data = request.data;
    switch (request.action) {
      case 11:
        MainSnakey.styles.populateList(Util.flattenStyle(data.style));
        break;
      case 12:
        MainSnakey.styles.reload();
        break;
      case 13:
        switch (data.changeType) {
          case "active":
            MainSnakey.styles.changeActive(data.style);
            break;
          default:
            let reloadButton = document.querySelector('.reload');
            reloadButton.click();
        }
        break;
      case 24:
        // TODO: manipulate things with snakey settings and stuff
        break;
    }
    sendResponse({});
});