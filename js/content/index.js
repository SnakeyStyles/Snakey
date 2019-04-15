let ContentSnakey = window.ContentSnakey = {
  Queue: new Queue(),
  armScripts() {
    let scripts = document.querySelectorAll("[snakey-id] script");
    Array.from(scripts).forEach(script => {
      if(script.type !== "application/json") return;
      let jsElem = document.createElement('script');
      jsElem.innerHTML = script.innerHTML;
      script.parentNode.appendChild(jsElem);
      script.remove();
    });
  }
};