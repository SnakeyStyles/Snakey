MainSnakey.add.fileService = function() {
  return document.querySelector('.file-service');
}

MainSnakey.add.urlInput = function() {
  return document.querySelector('.add-page-content .input-box input');
}

MainSnakey.add.urlValue = function() {
  return decodeURIComponent(MainSnakey.add.urlInput().value.trim());
}

MainSnakey.add.prompt = function() {
  return MainSnakey.add.fileService().click();
}

MainSnakey.add.onChange = async function(event) {
  let file = event.target.files[0];
  if(!!file) MainSnakey.add.style(await MainSnakey.add.getURL(file));
}

MainSnakey.add.getURL = function(file) {
  return new Promise((resolve, reject) => {
    var reader = new FileReader();
    reader.onload = event => resolve(event.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  })
}

MainSnakey.add.onInput = async function() {
  let serviceTooltip = document.querySelector('.service-tooltip');
  if(!serviceTooltip.classList.contains('hidden'))
    serviceTooltip.classList.add('hidden');
  document.querySelector('.input-box').classList.remove('error');
  if(!MainSnakey.add.urlValue()) return;
  try {
    let url = new URL(MainSnakey.add.urlValue());
  } catch (e) {
    document.querySelector('.input-box').classList.add('error');
    serviceTooltip.classList.remove('hidden');
    serviceTooltip.innerText = i18n('invalidURL');
    return;
  }
  let urlMatch = FormatURL.match(MainSnakey.add.urlValue());
  if(!!urlMatch.service) {
    serviceTooltip.classList.remove('hidden');
    serviceTooltip.innerText = urlMatch.service;
  }
}

MainSnakey.add.onSubmit = async function() {
  let url = FormatURL.match(MainSnakey.add.urlValue()).url;
  if(!url) return;
  MainSnakey.add.urlInput().value = "";
  let serviceTooltip = document.querySelector('.service-tooltip');
  if(!serviceTooltip.classList.contains('hidden'))
    serviceTooltip.classList.add('hidden');
  return MainSnakey.add.style(url);
}

MainSnakey.add.style = async function(url) {
  MainSnakey.loading(true);
  let response = await Snakey.sendToBackgroundWithResponse(15, { url });
  console.log('got response', response);
  if (response.ok === false) {
    let errorMsg = i18n("errorAddingStyle");
    switch (response.errorName) {
      case "SCHEMA_FAIL":
      case "CSS_PARSER":
        errorMsg = i18n('errorValidation'); break;
      case "FETCH_FAIL":
        errorMsg = i18n('errorFetching'); break;
      case "BAD_COMPONENT_KEY":
      case "BUILTIN_COMPONENT_FAIL":
        errorMsg = i18n('errorComponents'); break;
    }
    alert(errorMsg + " " + i18n("openConsole"));
    console.error(i18n('errorAddingStyle'), response);
  } else {
    await MainSnakey.changeContent('styles');
    if(response.parent_id)
      document.querySelector(`.style[id="${response.parent_id}"] .expand-clickbox`).click();
    let dom = document.getElementById(response.id);
    dom.classList.add('highlighted');
    dom.scrollIntoView();
  }
  MainSnakey.loading(false);
}