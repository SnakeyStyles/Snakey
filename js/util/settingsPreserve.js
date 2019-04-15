let SettingsPreserve = window.SettingsPreserve = {
  events: new EventTarget(),
  emit(type, data){
    let event = new Event(type);
    event.data = data;
    SettingsPreserve.events.dispatchEvent(event);
  }
};

Snakey.storage.settings().then(settings => {
  SettingsPreserve.settings = settings;
  SettingsPreserve.emit('start', settings);
});

chrome.runtime.onMessage.addListener(
  function(request) {
    if(request.action === 28) {
      SettingsPreserve.settings[request.data.key] = request.data.value;
      SettingsPreserve.emit('change', { settings: SettingsPreserve.settings, change: request.data });
    }
  }
);