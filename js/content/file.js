let FileSnakey = window.ContentSnakey = {};

FileSnakey.initialize = async function() {
  let locationURL = new URL(location.href);
  if(locationURL.searchParams.has('ignore_snakey')) return;
  Snakey.log('Redirecting');
  let prefix = 'data:application/json;base64,';
  let filePath = location.href.slice(7);
  let text = document.querySelector('pre').innerText;
  let url = new URL(Snakey.base.runtime.getURL('/pages/ask.html'));
  url.searchParams.append('url', prefix + btoa(text));
  url.searchParams.append('file', filePath);
  Snakey.sendToBackground(1002, { url: url.href });
} 

Snakey.storage.settings().then(settings => {
  if(settings.redirect_links && settings.redirect_file_links) ContentSnakey.initialize();
});