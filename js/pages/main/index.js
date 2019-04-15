let MainSnakey = {
  fuseOpts: {
    shouldSort: true,
    threshold: 0.2,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: ["name"]
  },
  add: {},
  styles: {}
}

MainSnakey.onContentChange = async function(page) {
  location.hash = page;
  if(page === "styles") {
    await MainSnakey.styles.reload();
    let href = new URL(location.href);
    let highlight = href.searchParams.get('highlight');
    if(highlight) {
      let dom = document.getElementById(highlight);
      if(dom.classList.contains('component'))
        dom.parentNode.parentNode.querySelector('.expand-clickbox').click();
      dom.classList.add('highlighted');
      dom.scrollIntoView();
    }
    history.pushState({urlPath:'/pages/main.html'},"",'/pages/main.html')
  }
}

MainSnakey.changeContent = async function(page) {
  let lastActive = document.querySelector(`.sidebar h4.active`);
  lastActive.classList.remove('active');
  let lastActiveContent = document.querySelector(`.${lastActive.getAttribute('page')}-page-content`);
  lastActiveContent.classList.add('hidden');
  let elem = document.querySelector(`.sidebar h4[page="${page}"]`);
  elem.classList.add('active');
  let contentDiv = document.querySelector(`.${page}-page-content`);
  contentDiv.classList.remove('hidden');
  await MainSnakey.onContentChange(page);
}

MainSnakey.loading = async function(value = true) {
  let loadingBackdrop = document.querySelector('.loading-backdrop');
  if(!value && !loadingBackdrop.classList.contains('hide'))
    loadingBackdrop.classList.add('hide'); else
    loadingBackdrop.classList.remove('hide');
}

MainSnakey.modalShow = async function(value = true) {
  let modalBackdrop = document.querySelector('.modal-backdrop');
  if(!value && !modalBackdrop.classList.contains('hide'))
    modalBackdrop.classList.add('hide'); else
    modalBackdrop.classList.remove('hide');
}