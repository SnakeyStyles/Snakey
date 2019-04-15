let SettingsDOMs = {
  create(option, key, value, type) {
    return SettingsDOMs[option.type](option, key, value, type);
  },
  _setSetting(key, value, settingType) {
    if(settingType === 1) Snakey.settings.set(key, value);
    if(typeof settingType === "function") settingType(key, value);
  },
  _createOuter(option, type) {
    let optionRowElem = DOMs._create('div', `option-row${
        !option.description ? ' no-desc' : ''
      }`);
    let metaElem = DOMs._create('div', "f left option-meta", optionRowElem);
    let titleElem = DOMs._create('h3', option.danger ? 'danger' : '', metaElem, option.title);
    if(option.description) {
      let descElem = DOMs._create('p', "", metaElem);
      descElem[type === 1 ? "innerHTML" : "innerText"] = option.description;
    }
    let optionElem = DOMs._create('div', "f right option-element", optionRowElem);
    return optionRowElem;
  },
  boolean(option, key, value, type) {
    let optionRowElem = SettingsDOMs._createOuter(option, type);
    let optionElem = optionRowElem.querySelector('.option-element');
    
    let toggleElem = DOMs._create('div', "toggle", optionElem);
    let checkboxElem = DOMs._create('input', null, toggleElem);
    checkboxElem.type = "checkbox";
    checkboxElem.checked = value;
    let checkboxSpanElem = DOMs._create('span', null, toggleElem);

    checkboxElem.addEventListener('change', function() {
      SettingsDOMs._setSetting(key, checkboxElem.checked, type);
    });
    checkboxElem.checked = value;

    return optionRowElem;
  },
  dropdown(option, key, value, type) {
    let optionRowElem = SettingsDOMs._createOuter(option, type);
    let optionElem = optionRowElem.querySelector('.option-element');
    
    let selectElem = DOMs._create('select', "", optionElem);
    Util.objectForEach(option.options, (k, v) => {
      let selectOptElem = DOMs._create('option', "", selectElem, v);
      selectOptElem.value = selectOptElem._trueValue = k;
    });
    let arrowElem = DOMs._create('div', 'dropdown-arrow', optionElem);

    selectElem.addEventListener('change', function() {
      let selectedOpt = selectElem.selectedOptions[0];
      SettingsDOMs._setSetting(key, selectedOpt._trueValue, type);
    });
    selectElem.value = value;

    return optionRowElem;
  },
  text(option, key, value, type) {
    let optionRowElem = SettingsDOMs._createOuter(option, type);
    let optionElem = optionRowElem.querySelector('.option-element');
    
    let inputElem = DOMs._create('input', "", optionElem);
    inputElem.type = "text";
    inputElem.addEventListener('change', function() {
      SettingsDOMs._setSetting(key, inputElem.value, type);
    });
    inputElem.value = value;

    return optionRowElem;
  },
  number(option, key, value, type) {
    let optionRowElem = SettingsDOMs._createOuter(option, type);
    let optionElem = optionRowElem.querySelector('.option-element');
    
    let inputElem = DOMs._create('input', "", optionElem);
    inputElem.type = "number";
    inputElem.addEventListener('change', function() {
      SettingsDOMs._setSetting(key, inputElem.value, type);
    });
    inputElem.value = value;

    return optionRowElem;
  }
}