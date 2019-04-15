let Util = {
  enableDarkMode(clickDiv) {
    let colorToggle = clickDiv || document.querySelector('.color_toggle');
    if(colorToggle._listenerAppended) return;
    colorToggle.addEventListener('click', function() {
      let classes = document.querySelector("html").classList;
      classes[
        classes.contains('dark-mode') ? 'remove' : 'add'
      ]('dark-mode');

      Snakey.settings.set("dark_mode", classes.contains('dark-mode'));
    });
    colorToggle._listenerAppended = true;
  },
  parseExpandables() {
    document.querySelectorAll('.expand-clickbox').forEach(el => {
      if(el._listenerAppended) return;
      el.addEventListener('click', function() {
        let classes = this.parentNode.classList;
        if(!classes.contains('expandable')) return;
        classes[
          classes.contains('expanded') ? 'remove' : 'add'
        ]('expanded');
      });
      el._listenerAppended = true;
    });
  },
  isUsingURL(style, matchedURL) {
    return style.urls
      .map(url => Match.match(url, matchedURL).matched)
      .includes(true);
  },
  isEmpty(object) {
    return object.length === 0 || Object.keys(object).length === 0;
  },
  flattenStyle(style) {
    let data = {}
    if(style.builtin_components) {
      Util.objectForEach(style.builtin_components, (_, component) => {
        component.built_in = true;
        component.style_type = "component";
        component.parent_id = style.id;
        component.urls = style.urls;
        if(!component.author)
          component.author = style.author;
        if(!component.simple_url)
          component.simple_url = style.simple_url;
        if(!component.description)
          component.description = `A component for ${style.name}`;
        data[component.id] = component;
      });
      delete style.builtin_components;
    }
    data[style.id] = style;
    return data;
  },
  promisify(f, ...a) {
    return new Promise(resolve => resolve(f(...a)));
  },
  promisifyCallback(f, ...a) {
    return new Promise(resolve => f(...a, resolve));
  },
  objectForEach(o, f) {
    Object.keys(o).forEach(k => f(k, o[k]));
  },
  objectToArray(o) {
    let newData = [];
    Util.objectForEach(o, (k, v) => newData.push([k, v]));
    return newData;
  },
  values(o) {
    return Util.objectToArray(o).map(i => i[1]);
  },
  favicon(type, url) {
    let prefixes = {
      1: "https://www.google.com/s2/favicons?domain=",
      2: "https://icons.duckduckgo.com/ip2/http://",
      3: "https://favicon.yandex.net/favicon/",
      4: "chrome://favicon/http://",
    }
    return prefixes[type] + url;
  },
  parseSettingObject(setting, value) {
    if(!value) value = setting.default;
    switch(setting.type) {
      case "text":
        if(setting.quotes) value = `"${value}"`;
        if(setting.url) value = `url(${value})`;
        break;
      case "number":
        if(setting.suffix) value = `${value}${setting.suffix}`;
        break;
      case "boolean":
        if(setting.if_true && value) value = setting.if_true;
        if(setting.if_false && !value) value = setting.if_false;
        break;
    }
    return value;
  },
  convertSettingsToCSS(settings, settingValues) {
    let result = `:root { `
    Util.objectForEach(settings, (id, setting) => {
      result += `--${id}: ${Util.parseSettingObject(setting, settingValues[id])}; `
    });
    result += "}";

    return result;
  }
}