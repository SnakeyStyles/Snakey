Snakey.styles = {};

Snakey.styles.getAll = async function() {
  let data = await Snakey.storage.get();
  return data.styles;
}

Snakey.styles.getAllFlattened = async function() {
  let data = await Snakey.styles.getAll();
  let newData = {};
  Util.objectForEach(data, (_, v) => {
    Util.objectForEach(Util.flattenStyle(v), (k2, v2) => newData[k2] = v2);
  });
  return newData;
}

Snakey.styles.getAllArray = async function() {
  let data = await Snakey.styles.get();
  let newData = [];
  Util.objectForEach(data, (_, v) => newData.push(v));
  return newData;
}

Snakey.styles.getAllArrayFlat = async function() {
  let data = await Snakey.styles.getAll();
  let newData = [];
  Util.objectForEach(data, (_, v) => newData.push(v));
  return newData;
}

Snakey.styles.get = async function(id) {
  let data = await Snakey.styles.getAllFlattened();
  if(data[id]) return data[id];
  return null;
}

Snakey.styles.getAllActive = async function() {
  let data = await Snakey.styles.getAllArrayFlat();
  return data.filter(style => style.active);
}

Snakey.styles.getAllInURL = async function(matchedURL) {
  let data = await Snakey.styles.getAllFlattened();
  let newData = {};
  Util.objectForEach(data, (k, v) => {
    v.urls.forEach(url => {
      if(Match.match(url, matchedURL).matched) newData[k] = v;
    });
  });
  return newData;
}

Snakey.styles.getActiveInURL = async function(url) {
  let data = await Snakey.styles.getAllInURL(url);
  Util.objectForEach(data, (k, v) => {
    if(!v.active) delete data[k];
  });
  return data;
}

Snakey.styles.setActive = async function(id, active) {
  let data = await Snakey.styles.getAll();
  let changeIn = null;
  Util.objectForEach(data, (sID, style) => {
    if(id === sID) {
      data[sID].active = active;
      return changeIn = sID;
    }
    if(style.builtin_components)
      Util.objectForEach(style.builtin_components, (cID, component) => {
        if(id === component.id) {
          data[sID].builtin_components[cID].active = active;
          return changeIn = sID;
        }
      });
  });

  if(!changeIn) return null;
  return await Snakey.sendToBackground(17, { id: changeIn, style: data[changeIn], changeType: "active" });
}