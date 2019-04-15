tabPurge = window.tabPurge = async function(){
  let tabs = await Snakey.tabs.getAll();
  tabs = tabs.filter(t => t.url.startsWith(chrome.extension.getURL('pages/menu.html')));
  let mainTab = tabs.shift();
  if(tabs.length !== 0){
    chrome.tabs.update(mainTab.id, { active: true });
    tabs.map(t => chrome.tabs.remove(t.id));
  };
}
