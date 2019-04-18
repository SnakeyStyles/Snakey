document.title = i18n('mainTitle');

Localize.documentReadyAndLocalisedAsPromised(document).then(async () => {
  Localize.resolveTooltips();
  Util.enableDarkMode(document.querySelector('.dark-mode-click-div'));
  await tabPurge();
  let settings = await Snakey.storage.settings();
  if(settings.dark_mode)
    document.querySelector("html").classList.add('dark-mode');
  document.querySelector('.content h2').innerHTML = i18n('mainStats', [0, 0, 0]);

  // Styles
  let searchBar = document.querySelector('.search');
  let reloadButton = document.querySelector('.reload');

  reloadButton.addEventListener('click', MainSnakey.styles.reload);
  searchBar.addEventListener('change', async () => {
    let searchText = searchBar.value;
    if(!searchText) return reloadButton.click();
    reloadButton.classList.add('hidden');
    let styles = await Snakey.styles.getAllArrayFlat();
    let searchedStyles = new Fuse(styles, MainSnakey.fuseOpts).search(searchText);
    let parsed = {};
    searchedStyles.forEach(style => {
      if(style.style_type === "style") parsed[style.id] = style;
    });
    await MainSnakey.styles.reloadWithStyles(searchedStyles);
    reloadButton.classList.remove('hidden');
  });

  // Sidebar navigation
  let page = location.hash.slice(1) || "styles";
  let contentDiv = document.querySelector(`.${page}-page-content`);
  if(!contentDiv) {
    page = "styles";
    contentDiv = document.querySelector(`.styles-page-content`);
  };
  location.hash = page;
  document.querySelectorAll('.page-content').forEach(elem => {
    let classes = elem.classList;
    if(!classes.contains('hidden')) classes.add('hidden');
  });
  let sidebarItem = document.querySelector(`.sidebar h4[page="${page}"]`);
  sidebarItem.classList.add('active');
  contentDiv.classList.remove('hidden');
  MainSnakey.onContentChange(page);

  document.querySelectorAll('.sidebar h4[page]').forEach(elem => 
    elem.addEventListener('click', () => {
      let lastActive = document.querySelector(`.sidebar h4.active`);
      lastActive.classList.remove('active');
      let lastActiveContent = document.querySelector(`.${lastActive.getAttribute('page')}-page-content`);
      lastActiveContent.classList.add('hidden');
      elem.classList.add('active');
      let contentDiv = document.querySelector(`.${elem.getAttribute('page')}-page-content`);
      contentDiv.classList.remove('hidden');
      MainSnakey.onContentChange(elem.getAttribute('page'));
    })
  );

  // Settings
  document.querySelectorAll('settings-link').forEach(elem => {
    let key = elem.getAttribute("key");
    let optionElem = SettingsDOMs.create(
      Settings[key], key,
      SettingsPreserve.settings[key], 1
    )
    elem.parentNode.insertBefore(optionElem, elem);
    elem.remove();
  });

  let chromeExtAnchor = document.querySelector('.chrome-ext');
  if(chromeExtAnchor) chromeExtAnchor.addEventListener('click', async function() {
    chrome.tabs.create({
      url: `chrome://extensions/?id=${chrome.extension.getURL('').split('/')[2]}`
    });
  });

  let versionText = document.querySelector('.version');
  versionText.innerText = i18n('version') + ' ' + Snakey.base.runtime.getManifest().version
    + `/ ${i18n('browser')}: ${Snakey.browser}`;

  // Modal
  let modalBackdrop = document.querySelector('.modal-backdrop');
  modalBackdrop.addEventListener('click', async function(e) {
    if(e.target.classList.contains('modal-inner'))
      modalBackdrop.classList.add('hide');
  });

  // Add
  let uploadButton = document.querySelector('.upload');
  MainSnakey.add.fileService().addEventListener('change', MainSnakey.add.onChange);
  uploadButton.addEventListener('click', MainSnakey.add.prompt);
  MainSnakey.add.urlInput().addEventListener('input', MainSnakey.add.onInput);
  document.querySelector('.add_from_url').addEventListener('click', MainSnakey.add.onSubmit);

  // GitHub Button
  if(document.querySelector('.github')) document.querySelector('.github').addEventListener(
    'click',
   () => Snakey.base.tabs.create({ url: 'https://github.com/SnakeyStyles/Snakey' })
  );

  MainSnakey.loading(false);
});