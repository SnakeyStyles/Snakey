ContentSnakey.initialize = async function() {
  Snakey.log('Initializing')
  let activeStyles = await Snakey.styles.getActiveInURL(document.location.href);
  Snakey.log('Active styles:', activeStyles);
  if(!Util.isEmpty(activeStyles)) await ContentSnakey.load(activeStyles);
  if(document.readyState === "complete") ContentSnakey.pushUp();
    else window.addEventListener('load', ContentSnakey.pushUp);
} 

ContentSnakey.pushUp = function() {
  if(ContentSnakey.snakeyDOM) document.head.appendChild(ContentSnakey.snakeyDOM);
    else setTimeout(ContentSnakey.pushUp, 500);
}

ContentSnakey.initialize();