let BackgroundSnakey = {};

(async function () {
  await Snakey.storage.initialize();
  let settings = await Snakey.storage.settings();
  BackgroundSnakey.redirectLinks = settings.redirect_links;
}());