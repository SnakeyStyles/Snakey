tabPurge = window.tabPurge = async function(){
  let tabs = await Snakey.tabs.getAll();
  tabs = tabs.filter(t => t.url.startsWith(Snakey.base.extension.getURL('pages/menu.html')));
  let mainTab = tabs.shift();
  if(tabs.length !== 0){
    Snakey.base.tabs.update(mainTab.id, { active: true });
    tabs.map(t => Snakey.base.tabs.remove(t.id));
  };
}
