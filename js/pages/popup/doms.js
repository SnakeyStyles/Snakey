let DOMs = {
  _create(tag, className, parent, text) {
    let el = document.createElement(tag);
    if(className) el.className = className;
    if(parent) parent.appendChild(el);
    if(text) el.innerText = text;
    return el;
  },
  style(style) {
    let styleElem = DOMs._create('div', `style${style.active ? ' active' : ''}`);
    styleElem.dataset.id = style.id;
    let metaElem = DOMs._create('div', "f left style-meta", styleElem);
    let toggleElem = DOMs._create('div', "toggle", metaElem);
    let checkboxElem = DOMs._create('input', null, toggleElem);
    checkboxElem.type = "checkbox";
    checkboxElem.checked = style.active;
    checkboxElem.addEventListener('click', checkboxElem._clickFunction = function() {
      let classes = this.parentNode.parentNode.parentNode.classList;
      if(classes.contains('error')) return;
      classes[
        classes.contains('active') ? 'remove' : 'add'
      ]('active');

      Snakey.styles.setActive(style.id, classes.contains('active'));
    });
    let checkboxSpanElem = DOMs._create('span', null, toggleElem);
    checkboxElem.type = "checkbox";
    let titleElem = DOMs._create('h3', "style-title", metaElem, style.name);
    titleElem.setAttribute('title', style.name);
    let authorElem = DOMs._create('h3', "style-author", metaElem, style.author);
    let badgesElem = DOMs._create('div', "f right style-badges", styleElem);
    return styleElem;
  },
  makeExpandable(styleElem) {
    if(styleElem.classList.contains('expandable')) return;
    styleElem.classList.add('expandable');
    let clickboxElem = DOMs._create('div', "expand-clickbox");
    clickboxElem._listenerAppended = true;
    clickboxElem.addEventListener('click', clickboxElem._clickFunction = function() {
      let classes = this.parentNode.classList;
      if(!classes.contains('expandable')) return;
      classes[
        classes.contains('expanded') ? 'remove' : 'add'
      ]('expanded');
    });
    styleElem.insertBefore(clickboxElem, styleElem.querySelector('.style-meta'));
    let componentsElem = DOMs._create('div', "style-components", styleElem);
    return styleElem;
  },
  component(component) {
    let styleElem = DOMs.style(component);
    styleElem.dataset.id = component.id;
    styleElem.classList.add('component');
    return styleElem;
  },
  styleEmpty(text, isError = false) {
    let styleEmptyElem = DOMs._create('div', `style-empty${isError ? ' error' : ''}`, document.querySelector('.styles'));
    let iElem = DOMs._create('i', null, styleEmptyElem, text);
    let aElem = DOMs._create('a', null, styleEmptyElem, i18n("viewStyles"));
    aElem.href = "./main.html#styles";
    aElem.target = "_blank";
    return styleEmptyElem;
  }
}