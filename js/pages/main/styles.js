MainSnakey.styles.clearList = function() {
  document.querySelectorAll('.style').forEach(elem => elem.remove());
  let stylesEmpty = document.querySelector('.styles-empty');
  if(stylesEmpty) stylesEmpty.remove();
}

MainSnakey.styles.populateList = async function(givenStyles) {
  let allStyles = givenStyles || await Snakey.styles.getAllFlattened();
  let styles = [];
  let components = [];
  Util.objectForEach(allStyles, (_, style) => {
    if(style.style_type === "style")
      styles.push(style);
    if(style.style_type === "component")
      components.push(style);
  });
  if(!styles.length && !components.length)
    return MainSnakey.styles.showStyleEmpty();
  else {
    let stylesEmpty = document.querySelector('.styles-empty');
    if(stylesEmpty) stylesEmpty.remove();
  }
  styles.forEach(MainSnakey.styles.appendStyle);
  components.forEach(MainSnakey.styles.appendComponent);
}

MainSnakey.styles.showStyleEmpty = function() {
  return DOMs._create(
    'i',
    'styles-empty',
    document.querySelector('.styles-page-content'),
    i18n("noStyles")
  );
}

MainSnakey.styles.appendStyle = function(style) {
  let dom = DOMs.style(style);
  dom.querySelector('.settings').addEventListener(
    'click',
    () => MainSnakey.styleSettings.launch(style.id)
  );
  document.querySelector('.styles-page-content').appendChild(dom);
}

MainSnakey.styles.changeActive = function(style) {
  let dom = document.querySelector(`.style[id="${style.id}"]`);
  let active = style.active;
  dom.classList[
    active ? 'add' : 'remove'
  ]('active');
  dom.querySelector('input').checked = active;
  if(style.builtin_components)
    Util.objectForEach(style.builtin_components, (_,v) => MainSnakey.styles.changeActive(v));
}

MainSnakey.styles.appendComponent = function(component) {
  let dom = DOMs.component(component);
  let parentDOM = document.querySelector(`.style[id="${component.parent_id}"]`);
  DOMs.makeExpandable(parentDOM);
  dom.querySelector('.settings').addEventListener(
    'click',
    () => MainSnakey.styleSettings.launch(component.id)
  );
  parentDOM.querySelector('.style-components').appendChild(dom);
}

MainSnakey.styles.reloadWithStyles = async function(styles) {
  MainSnakey.styles.clearList();
  let count = [0, 0, 0];
  Util.objectForEach(styles, (_, style) => {
    if(style.style_type === "style") count[0]++;
    if(style.style_type === "component") count[1]++;
    if(style.built_in === false) count[2]++;
  });
  document.querySelector('.content h2').innerHTML = i18n('mainStats', count);
  await MainSnakey.styles.populateList(styles);
}

MainSnakey.styles.removeStyle = function(id) {
  let dom = document.querySelector(`.style[id="${id}"]`);
  if(dom) dom.remove();
  if(!document.querySelector('.style')) MainSnakey.styles.showStyleEmpty();
}

MainSnakey.styles.reload = async function() {
  let reloadButton = document.querySelector('.reload');
  let searchBar = document.querySelector('.search');
  reloadButton.classList.add('hidden');
  searchBar.value = "";
  await MainSnakey.styles.reloadWithStyles(await Snakey.styles.getAllFlattened());
  reloadButton.classList.remove('hidden');
}