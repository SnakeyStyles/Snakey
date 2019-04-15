let DOMs = {
  _create(tag, className, parent, text) {
    let el = document.createElement(tag);
    if(className) el.className = className;
    if(parent) parent.appendChild(el);
    if(text) el.innerText = text;
    return el;
  },
  style(style) {
    // TODO: fix relative tooltips
    let styleElem = DOMs._create('div', `style${
      style.style_type === "component" ? ' component' : ''
    }${
      style.active ? ' active' : ''
    }`);
    styleElem.setAttribute("id", style.id);
    // CSS/JS Tags
    if(style.css_link) {
      let cssTagElem = DOMs._create('span', "style-tag css", styleElem);
      tippy(cssTagElem, {
        content: i18n('containsCSS'),
        boundary: "window"
      });
    }
    if(style.js_link) {
      let jsTagElem = DOMs._create('span', "style-tag js", styleElem);
      tippy(jsTagElem, {
        content: i18n('containsJS'),
        boundary: "window"
      });
    }
    let metaElem = DOMs._create('div', "f left style-meta", styleElem);
    // Checkbox
    let toggleElem = DOMs._create('div', "toggle", metaElem);
    let checkboxElem = DOMs._create('input', null, toggleElem);
    checkboxElem.type = "checkbox";
    checkboxElem.checked = style.active;
    checkboxElem.addEventListener('click', function() {
      let classes = this.parentNode.parentNode.parentNode.classList;
      if(classes.contains('error')) return;
      classes[
        classes.contains('active') ? 'remove' : 'add'
      ]('active');

      Snakey.styles.setActive(style.id, classes.contains('active'));
    });
    let checkboxSpanElem = DOMs._create('span', null, toggleElem);
    // Meta
    let titleElem = DOMs._create('h3', "style-title", metaElem, style.name);
    titleElem.setAttribute('title', style.name);
    if(SettingsPreserve.settings.debug) tippy(titleElem, {
      content: "ID: " + style.id,
      placement: 'top-start',
      interactive: true,
      boundary: "window"
    });
    // Favicons
    let favicons = {};
    style.urls.forEach(url => {
      let sURL = Snakey.tabs.simplifyURL(url);
      if(favicons[sURL]) {
        favicons[sURL].push(url);
      } else favicons[sURL] = [url];
    });
    Util.objectForEach(favicons, (url, matches) => {
      let imgElem = DOMs._create('img', 'favicon', titleElem);
      imgElem.src = Util.favicon(SettingsPreserve.settings.favicon_service, url);
      tippy(imgElem, {
        content: matches.filter(match => match.replace(">", "&gt;").replace("<", "&lt;")).join('<br>'),
        allowHTML: true,
        placement: 'bottom',
        boundary: "window"
      });
    });
    let authorElem = DOMs._create('h3', "style-author", metaElem, style.author);
    // Badges
    let badgesElem = DOMs._create('div', "f right style-badges", styleElem);
    let settingBadgeElem = DOMs._create('div', "badge settings", badgesElem);
    tippy(settingBadgeElem, {
      content: i18n('settings'),
      boundary: "window"
    });
    if(!style.built_in && style.style_type === "component") {
      let extCompElem = DOMs._create('div', "badge external_component", badgesElem);
      tippy(extCompElem, {
        content: i18n('externalComp'),
        boundary: "window"
      });
    }
    return styleElem;
  },
  makeExpandable(styleElem) {
    if(styleElem.classList.contains('expandable')) return;
    styleElem.classList.add('expandable');
    let clickboxElem = DOMs._create('div', "expand-clickbox");
    clickboxElem._listenerAppended = true;
    clickboxElem.addEventListener('click', function() {
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
    styleElem.classList.add('component');
    styleElem.querySelectorAll('.favicon').forEach(elem => elem.remove());
    return styleElem;
  }
}