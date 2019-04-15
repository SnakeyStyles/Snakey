ContentSnakey.load = async function(styles) {
  ContentSnakey.loaded = true;
  Snakey.log('Appending snakey element');
  let snakeyElem = ContentSnakey.snakeyDOM = document.createElement('snakey');
  document.head.appendChild(snakeyElem);
  let snakeyStylesElem = ContentSnakey.stylesDOM = document.createElement('snakey-styles');
  snakeyElem.appendChild(snakeyStylesElem);
  await ContentSnakey.loadStyles(styles);
}

ContentSnakey.getStyleElement = function(id) {
  return document.querySelector(`[snakey-id="${id}"]`)
}

ContentSnakey.getStyleComponentElements = function(id) {
  return document.querySelectorAll(`[snakey-parent-id="${id}"]`)
}

ContentSnakey.loadStyles = async function(styles) {
  let activeStyles = styles || await Snakey.styles.getActiveInURL(document.location.href);
  ContentSnakey.Queue.pause();
  await ContentSnakey.loadStyleBunch(activeStyles);
  ContentSnakey.Queue.resume();
}

ContentSnakey.loadStyleBunch = async function(styles) {
  if(!ContentSnakey.loaded) await ContentSnakey.load();
  styles = Util.values(styles);
  let styleSettings = await Snakey.storage.styleSettings();
  let components = [];
  // append styles and queue components
  styles.forEach(style => {
    if(ContentSnakey.getStyleElement(style.id) || !style.active) return;
    let elem = ContentSnakey.styleToElement(style, styleSettings[style.id]);
    if(elem) {
      if(elem.nodeName === "SNAKEY-COMPONENT") return components.push(elem);
      ContentSnakey.stylesDOM.appendChild(elem);
      Snakey.debug('Appended style', elem.getAttribute('snakey-id'));
    }
  });
  // append components
  components.forEach(component => {
    let parentStyle = ContentSnakey.getStyleElement(component.getAttribute('snakey-parent-id'));
    if(!parentStyle) return Snakey.log("Cannot load component", component.getAttribute('snakey-id'), "parent style", component.getAttribute('snakey-parent-id'), "missing");
    parentStyle.appendChild(component);
    Snakey.debug('Appended component', component.getAttribute('snakey-id'));
  })
}

ContentSnakey.styleToElement = function(style, styleSettings) {
  let mainElem = document.createElement(style.style_type === "component" ? 'snakey-component' : 'snakey-style');
  mainElem.setAttribute('snakey-id', style.id);
  if(style.style_type === "component") mainElem.setAttribute('snakey-parent-id', style.parent_id);
  if(style._internal.css_content) {
    let cssElem = document.createElement('style');
    cssElem.innerHTML = style._internal.css_content;
    mainElem.appendChild(cssElem);
    if(style.settings) {
      let settingsElem = document.createElement('snakey-settings');
      let settingCssElem = document.createElement('style');
      settingCssElem.innerHTML = Util.convertSettingsToCSS(style.settings, styleSettings);
      settingsElem.appendChild(settingCssElem);
      mainElem.appendChild(settingsElem);
    }
  }
  if(style._internal.js_content) {
    let jsElem = document.createElement('script');
    jsElem.type = "application/json"; // disarms code
    jsElem.innerHTML = style._internal.js_content;
    mainElem.appendChild(jsElem);
  }
  return mainElem;
}

ContentSnakey.refreshStyleSettings = async function(id) {
  let styleSettingsCSS = document.querySelector(`[snakey-id="${id}"] > snakey-settings > style`);
  if(!styleSettingsCSS) return;
  let style = await Snakey.styles.get(id);
  let styleSettings = await Snakey.storage.getStyleSettings(id);
  styleSettingsCSS.innerHTML = Util.convertSettingsToCSS(style.settings, styleSettings);
  console.log('changed')
}

ContentSnakey.removeStyles = async function() {
  if(!ContentSnakey.loaded) await ContentSnakey.load();
  ContentSnakey.stylesDOM.innerHTML = "";
}

ContentSnakey.removeStyle = function(id) {
  let elem = ContentSnakey.getStyleElement(id);
  if(elem) elem.remove();
}

ContentSnakey.refreshStyles = async function() {
  await ContentSnakey.removeStyles();
  await ContentSnakey.loadStyles();
}