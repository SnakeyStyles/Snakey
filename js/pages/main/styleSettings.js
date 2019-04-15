MainSnakey.styleSettings = {};

MainSnakey.styleSettings.launch = async function(id) {
  let modal = document.querySelector('.modal');
  modal.innerHTML = "";
  let style = await Snakey.styles.get(id);
  let styleSettings = await Snakey.storage.getStyleSettings(id);
  let title = DOMs._create('h1', '', modal, style.name);
  if(SettingsPreserve.settings.debug)
    DOMs._create('code', 'id-title', modal, style.id);
  if(style.style_type === "component" && SettingsPreserve.settings.debug)
    DOMs._create('code', 'id-title', modal, i18n('parent') + ": " + style.parent_id);

  if(style.style_type === "component") {
    let gotoParentButton = DOMs._create('button', 'modal-button', modal, i18n('gotoParent'));
    gotoParentButton.addEventListener('click', async () => {
      MainSnakey.styleSettings.launch(style.parent_id);
    });
  }

  DOMs._create('hr', '', modal);

  MainSnakey.styleSettings.appendStyleInfo(style);

  DOMs._create('hr', '', modal);

  let enableElem = SettingsDOMs.create(
    {
      type: "boolean",
      title: i18n('enable')
    }, "active",
    style.active, (_, v) => Snakey.styles.setActive(id, v)
  );
  modal.appendChild(enableElem);

  DOMs._create('hr', '', modal);

  if(styleSettings) {
    let title = DOMs._create('h1', '', modal, i18n('settings'));

    let settingsContainer = DOMs._create('div', 'indent', modal);

    Util.objectForEach(style.settings, (k, v) => {
      let elem = SettingsDOMs.create(
        v, "active", styleSettings[k],
        (_, v2) => Snakey.sendToBackground(18, { id, key: k, value: v2 })
      );
      settingsContainer.appendChild(elem);
    });
  }

  if(style.built_in !== true) {
    let deleteButton = DOMs._create('button', 'modal-button delete-button', modal, i18n('delete'));
    deleteButton.addEventListener('click', async () => {
      let settings = await Snakey.storage.settings();
      let confirmed = settings.warn_before_delete ? confirm(i18n('deleteConfirm')) : true;
      if(confirmed) {
        MainSnakey.loading(true);
        MainSnakey.modalShow(false);
        await Snakey.sendToBackground(16, { id });
        MainSnakey.loading(false);
      }
    });
  }

  MainSnakey.modalShow(true);
}

MainSnakey.styleSettings.appendStyleInfo = async function(style) {
  let modal = document.querySelector('.modal');
  // Basic Info
  MainSnakey.styleSettings.infoRow(i18n('author'), style.author, modal);

  if(style.description)
    MainSnakey.styleSettings.infoRow(i18n('description'), style.description, modal);

  MainSnakey.styleSettings.infoRow(i18n('version'), style.version, modal);

  if(style.tags)
    MainSnakey.styleSettings.infoRow(i18n('tags'), style.tags.join(', '), modal);

  // URLs
  let urlContainer = DOMs._create('p', 'url-container');
  if(style.urls) {
    style.urls.forEach(url => {
      let imgElem = DOMs._create('img', 'favicon', urlContainer);
      imgElem.src = Util.favicon(
        SettingsPreserve.settings.favicon_service,
        Snakey.tabs.simplifyURL(url)
      );
      DOMs._create('p', '', urlContainer, url);
      DOMs._create('br', '', urlContainer);
    });
    MainSnakey.styleSettings.infoRow(i18n('urls'), urlContainer, modal);
  }

  // Links
  let linkContainer = DOMs._create('p', 'link-container');
  if(style.css_link) {
    let cssLink = DOMs._create('a', 'link', linkContainer, i18n('cssFile'));
    cssLink.href = style.css_link;
  }
  if(style.js_link) {
    let jsLink = DOMs._create('a', 'link', linkContainer, i18n('jsFile'));
    jsLink.href = style.js_link;
  }
  if(style.homepage) {
    let homepageLink = DOMs._create('a', 'link', linkContainer, i18n('homepage'));
    homepageLink.href = style.homepage;
  }
  MainSnakey.styleSettings.infoRow(i18n('links'), linkContainer, modal);
}

MainSnakey.styleSettings.infoRow = async function(name, value, parent) {
  let field = DOMs._create('div', 'text-row', parent);
  let titleDom = DOMs._create('div', 'text-title', field, name);
  let valueDom = DOMs._create('div', 'text-value', field);
  if(value instanceof Element) valueDom.append(value);
    else valueDom.innerText = value;
  return field;
}