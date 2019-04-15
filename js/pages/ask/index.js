let AskSnakey = {
  convertStyle(dom) {
    let expandClickbox = dom.querySelector('.expand-clickbox');
    if(expandClickbox) expandClickbox.removeEventListener('click', expandClickbox._clickFunction);
    dom.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
      checkbox.removeEventListener('click', checkbox._clickFunction);
      checkbox.checked = false;
    });
    dom.querySelectorAll('.active').forEach(elem => elem.classList.remove('active'));
    if(dom.classList.contains('expandable')) dom.classList.add('expanded');
    return dom;
  },
  error(title) {
    let errorTitle = DOMs._create('h1', 'error', document.querySelector('.ask-inner-body'), title);
    let consoleText = DOMs._create('p', '', document.querySelector('.ask-inner-body'), i18n('openConsole'));
    document.querySelector('.style-eval').remove();
  },
  warning(title) {
    let h1 = document.querySelector('h1');
    if(!h1.classList.contains('error')) h1.classList.add('error');
    if(h1.classList.contains('flash')) h1.classList.remove('flash');
    h1.classList.add('flash');
    h1.innerText = title;
  },
  addFooterButton(name, hrefOrFunc, isInstall = false) {
    let button = DOMs._create('a', isInstall ? 'install' : '', document.querySelector('.button-container'), name);
    if(typeof hrefOrFunc === "string") button.href = hrefOrFunc;
      else; button.addEventListener('click', hrefOrFunc);
  },
  addTextField(name, value) {
    let field = DOMs._create('div', 'text-row', document.querySelector('.style-text'));
    let titleDom = DOMs._create('div', 'text-title', field, name);
    let valueDom = DOMs._create('div', 'text-value', field);
    if(value instanceof Element) valueDom.append(value);
      else valueDom.innerText = value;
  }
};