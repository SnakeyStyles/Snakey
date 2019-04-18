
document.title = i18n('askTitle');

Localize.documentReadyAndLocalisedAsPromised(document).then(async () => {
  Localize.resolveTooltips();
  let settings = await Snakey.storage.settings();
  if(settings.dark_mode)
    document.querySelector("html").classList.add('dark-mode');

  AskSnakey.addFooterButton(i18n('close'), () => window.close());

  let url = new URL(location.href);
  let styleURL = url.searchParams.get('url');
  if(!styleURL) return AskSnakey.error(i18n('noURL'));
  let filePath = url.searchParams.get('file');
  let rawURL = new URL(filePath ? "file://" + filePath : styleURL);
  rawURL.searchParams.append('ignore_snakey', '1');
  AskSnakey.addFooterButton(i18n('viewRaw'), () => Snakey.base.tabs.create({ url: rawURL.href }));

  let response = await PromisedRequest.send(1001, { url: styleURL });
  console.log(response);
  if(response.ok === false) {
    let errorMsg = i18n("errorValidation");
    switch (response.errorName) {
      case "FETCH_FAIL":
        errorMsg = i18n('errorFetching'); break;
      case "BAD_COMPONENT_KEY":
      case "BUILTIN_COMPONENT_FAIL":
        errorMsg = i18n('errorComponents'); break;
    }
    AskSnakey.error(errorMsg);
  } else {
    let style = response.style;
    let styles = await Snakey.styles.getAllFlattened();
    if(styles[style.id] || styles[style.parent_id + '.' + style.id])
      AskSnakey.warning(i18n('styleExists'));
    if(style.parent_id && !styles[style.parent_id])
      AskSnakey.warning(i18n('noParent'));

    AskSnakey.addTextField(i18n('type'), style.style_type);
    AskSnakey.addTextField(i18n('name'), style.name); 
    AskSnakey.addTextField(i18n('author'), style.author); 
    if(settings.debug) {
      if(style.parent_id)
        AskSnakey.addTextField(
          i18n('parentID'),
          DOMs._create('code', '', null, style.parent_id)
        );
      AskSnakey.addTextField(i18n('id'), DOMs._create(
        'code', '', null,
        (style.parent_id ? style.parent_id + "." : '') + style.id)
      );
    }
    AskSnakey.addTextField(i18n('version'), style.version);
    if(style.tags) {
      let tagsContainer = DOMs._create('p', 'tags-container');
      style.tags.forEach(tag => DOMs._create('span', 'tag', tagsContainer, tag));
      AskSnakey.addTextField(i18n('tags'), tagsContainer);
    }
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
      AskSnakey.addTextField(i18n('urls'), urlContainer);
    }
    
    // File Path
    if(filePath) {
      let filePathDom = DOMs._create('p', '', null, filePath);
      document.querySelector('.style-eval').insertBefore(
        filePathDom,
        document.querySelector('.style-container')
      );
    }

    // Components
    if(style.builtin_components) {
      let componentContainer = DOMs._create('p', 'components-container');
      Util.objectForEach(style.builtin_components, (key, component) => {
        let tag = DOMs._create('span', 'tag', componentContainer, component.name);
        if(settings.debug) DOMs._create('code', '', tag, key);
      });
      AskSnakey.addTextField(i18n('components'), componentContainer);
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
    AskSnakey.addTextField(i18n('links'), linkContainer);

    // Style Container
    let styleDom = DOMs.style(style);
    if(style.builtin_components) {
      DOMs.makeExpandable(styleDom);
      response.components.forEach(component => 
        styleDom.querySelector('.style-components').appendChild(DOMs.component(component.style)));
    }
    AskSnakey.convertStyle(styleDom);
    document.querySelector('.style-container').appendChild(styleDom);

    // Install
    AskSnakey.addFooterButton(i18n('install'), async () => {
      let h1 = document.querySelector('h1');
      if(h1.classList.contains('error')) h1.classList.remove('error');
      if(h1.classList.contains('flash')) h1.classList.remove('flash');
      h1.innerText = "Installing...";
      let style = response.style;
      let styles = await Snakey.styles.getAllFlattened();
      if(styles[style.id] || styles[style.parent_id + '.' + style.id])
        return AskSnakey.warning(i18n('styleExists'));
      if(style.parent_id && !styles[style.parent_id])
        return AskSnakey.warning(i18n('noParent'));
      MainSnakey.loading(true);
      let newResponse = await PromisedRequest.send(15, { url: styleURL });
      console.log('got response', newResponse);
      if (newResponse.ok === false) {
        let errorMsg = i18n("errorAddingStyle");
        switch (newResponse.errorName) {
          case "SCHEMA_FAIL":
          case "CSS_PARSER":
            errorMsg = i18n('errorValidation'); break;
          case "FETCH_FAIL":
            errorMsg = i18n('errorFetching'); break;
          case "BAD_COMPONENT_KEY":
          case "BUILTIN_COMPONENT_FAIL":
            errorMsg = i18n('errorComponents'); break;
        }
        AskSnakey.error(errorMsg);
        console.error(i18n('errorAddingStyle'), newResponse);
        MainSnakey.loading(false);
        document.querySelector('.install').remove();
      } else
        location.href = Snakey.base.runtime.getURL('/pages/main.html?highlight=' + newResponse.id + '#styles');
    }, true);
  }
}).then(() => MainSnakey.loading(false));