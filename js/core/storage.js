Snakey.storage = {};

Snakey.storage.get = function(...a) {
  return Util.promisifyCallback(Snakey.base.storage.local.get.bind(Snakey.base.storage.local), ...a);
}

Snakey.storage.set = function(...a) {
  return Util.promisifyCallback(Snakey.base.storage.local.set.bind(Snakey.base.storage.local), ...a);
}

Snakey.storage.remove = function(...a) {
  return Util.promisifyCallback(Snakey.base.storage.local.remove.bind(Snakey.base.storage.local), ...a);
}

Snakey.storage.initialize = async function() {
  let data = await Snakey.storage.get();
  if(!data || !Object.keys(data).length){
    Snakey.log('Building data');
    return await Snakey.storage.set({
      data_ver: Constants.Versions.Data,
      settings: {
        data_ver: Constants.Versions.Settings,
        enable_js: false,
        load_over_http: true,
        save_settings_after_delete: true,
        warn_before_delete: true,
        favicon_service: "1",
        dark_mode: true,
        redirect_links: true,
        redirect_file_links: true,
        debug: false
      },
      styles: {},
      style_settings: {}
    })
  }
}

Snakey.storage.updateStyle = async function(id, style) {
  let data = await Snakey.storage.get();
  data.styles[id] = style;
  return await Snakey.storage.set(data);
}

Snakey.storage.removeStyle = async function(...ids) {
  let data = await Snakey.storage.get();
  ids.forEach(id => delete data.styles[id]);
  return await Snakey.storage.set(data);
}

Snakey.storage.styleSettings = async function() {
  let data = await Snakey.storage.get();
  return data.style_settings;
}

Snakey.storage.getStyleSettings = async function(id) {
  let data = await Snakey.storage.get();
  return data.style_settings[id]
}

Snakey.storage.setStyleSetting = async function(id, key, value) {
  let data = await Snakey.storage.get();
  if(!data.style_settings[id]) data.style_settings[id] = {};
  data.style_settings[id][key] = value;
  return await Snakey.storage.set(data);
}

Snakey.storage.bulkUpdateStyleSettings = async function(bulk) {
  let data = await Snakey.storage.get();
  Util.objectForEach(bulk, (id, settings) => data.style_settings[id] = settings)
  return await Snakey.storage.set(data);
}

Snakey.storage.removeStyleSettings = async function(...ids){
  let data = await Snakey.storage.get();
  ids.forEach(id => delete data.style_settings[id]);
  return await Snakey.storage.set(data);
}

Snakey.storage.settings = async function() {
  let data = await Snakey.storage.get();
  return data.settings;
}

Snakey.storage.setSetting = async function(key, value) {
  let data = await Snakey.storage.get();
  data.settings[key] = value;
  return await Snakey.storage.set(data);
}

Snakey.settings = {};

Snakey.settings.set = function(key, value) {
  return Snakey.sendToBackground(28, { key, value });
}