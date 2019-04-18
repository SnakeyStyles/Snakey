BackgroundSnakey.emitter = {};

BackgroundSnakey.emitter.send = function(id, action, data, sender = null, requestID = null) {
  return Snakey.base.tabs.sendMessage(id, { action, data, sender, requestID });
}

BackgroundSnakey.emitter.sendWithResponse = function(id, action, data) {
  return new Promise((resolve) => {
    Snakey.base.tabs.sendMessage(id, { action, data }, resolve);
  });
}

BackgroundSnakey.emitter.sendToAll = async function(action, data, sender) {
  console.log('Emitting to all:', { action, data, sender });
  let tabs = await Snakey.tabs.getAll();
  tabs.forEach(tab => BackgroundSnakey.emitter.send(tab.id, action, data, sender));
}