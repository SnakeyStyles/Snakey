let PopupSnakey = {}

PopupSnakey.clearList = function() {
  document.querySelector('.styles').innerHTML = "";
}

PopupSnakey.populateList = async function() {
  let allStyles = await Snakey.styles.getAllInURL(PopupSnakey.tab.url);
  let styles = [];
  let components = [];
  Util.objectForEach(allStyles, (_, style) => {
    if(style.style_type === "style")
      styles.push(style);
    if(style.style_type === "component")
      components.push(style);
  });
  if(!styles.length) return DOMs.styleEmpty(i18n("noStyles"));
  styles.forEach(PopupSnakey.appendStyle);
  components.forEach(PopupSnakey.appendComponent);
}

PopupSnakey.appendStyle = function(style) {
  let dom = DOMs.style(style);
  document.querySelector('.styles').appendChild(dom);
}

PopupSnakey.appendComponent = function(component) {
  let dom = DOMs.component(component);
  let parentDOM = document.querySelector(`.style[data-id="${component.parent_id}"]`);
  DOMs.makeExpandable(parentDOM);
  parentDOM.querySelector(`.style-components`).appendChild(dom);
}

Localize.documentReadyAndLocalisedAsPromised(document)
.then(getCurrentTab).then(async currentTab => {
  PopupSnakey.tab = currentTab;
  Localize.resolveTooltips();
  document.querySelector(".domain").innerText = Snakey.tabs.simplifyURL(currentTab.url);
  let settings = await Snakey.storage.settings();
  if(settings.dark_mode) document.querySelector("html").classList.add('dark-mode');

  // GitHub Button
  if(document.querySelector('.github')) document.querySelector('.github').addEventListener(
    'click',
   () => Snakey.base.tabs.create({ url: 'https://github.com/SnakeyStyles/Snakey' })
  );

  if(!Snakey.tabs.urlSupported(currentTab.url))
    DOMs.styleEmpty(i18n("cannotStyle"), true);
  else {
    PopupSnakey.clearList();
    await PopupSnakey.populateList();
  }
});