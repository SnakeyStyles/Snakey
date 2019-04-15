Snakey.styles.add = async function({ styleObject, url, dry = false }, doNotFinish = false) {
  let evaluation = url
    ? await BackgroundSnakey.Validator.validateWithURL(url, { dry })
    : await BackgroundSnakey.Validator.validate(styleObject, { dry });
  let allSettings = {

  };
  
  if(!evaluation.ok || dry) return evaluation;
  let style = evaluation.style;
  console.log("Evaluation passed, doing additional checks", { styleObject, style, url, evaluation });

  let styles = await Snakey.styles.getAllFlattened();
  console.log("Retrieved styles", { styles });

  if(styles[style.id])
    return new ValidationError(
      "DUPLICATE_ID",
      { existingStyle: styles[style.id], style },
      [ style.id ]
    );

  if(style.parent_id && !styles[style.parent_id])
    return new ValidationError(
      "MISSING_PARENT",
      { style },
      [ style.parent_id ]
    );
  
  console.log("Finalizing data", { style, url, evaluation });
  
  style._internal = {
    css_content: evaluation.css,
    js_content: evaluation.js
  }

  style.active = true;

  if(style.builtin_components)
    await Promise.all(evaluation.components.map(async componentEval => {
      console.log("Finalizing component", { style, componentEval })
      let component = componentEval.style;
      let componentID = componentEval.id;
      let fullID = style.id + "." + componentID;

      let existingSettings = await Snakey.storage.getStyleSettings(fullID);
      if(!existingSettings && component.settings) {
        allSettings[fullID] = {};
        Util.objectForEach(component.settings, (k, v) => allSettings[fullID][k] = v.default);
      }

      style.builtin_components[componentID]._internal = {
        css_content: componentEval.css,
        js_content: componentEval.js
      }

      style.builtin_components[componentID].active = component.default !== undefined ? component.default : true;
      style.builtin_components[componentID].id = fullID;
    }));

  if(style.parent_id) {
    let parent = styles[style.parent_id];
    style.built_in = false;
    style.urls = parent.urls;
    style.simple_url = parent.simple_url;
    if(!style.description)
      style.description = `A component for ${parent.name}`;
    style.component_id = style.id;
    style.id = style.parent_id + "." + style.id;
  }

  let existingSettings = await Snakey.storage.getStyleSettings(style.id);
  if(!existingSettings && style.settings) {
    allSettings[style.id] = {};
    Util.objectForEach(style.settings, (k, v) => allSettings[style.id][k] = v.default);
  }

  if(doNotFinish) return { styles, style, allSettings };
  
  console.log("Emiting STYLE_ADD", { style, url, evaluation, allSettings });

  await Snakey.storage.updateStyle(style.id, style);
  await Snakey.storage.bulkUpdateStyleSettings(allSettings);
  await BackgroundSnakey.emitter.sendToAll(11, { style });
  return style;
}

Snakey.styles.remove = async function(id, doNotFinish = false) {
  let styles = await Snakey.styles.getAll();
  let stylesArray = [];
  Util.objectForEach(styles, (_, v) => {
    Util.objectForEach(Util.flattenStyle(v), (_, v2) => stylesArray.push(v2));
  });

  if(!id || !styles[id])
    return new ValidationError(
      "NONEXISTANT",
      { id }
    );
  
  let externalChildrenIDs = stylesArray
    .filter(style => style.parent_id === id)
    .map(style => style.id);

  if(doNotFinish) return { styles, stylesArray, externalChildrenIDs };
  let settings = await Snakey.storage.settings();
  
  
  console.log("Finalizing removal and emitting", { id, externalChildrenIDs });

  await Snakey.storage.removeStyle(id, ...externalChildrenIDs);
  if(!settings.save_settings_after_delete)
    await Snakey.storage.removeStyleSettings(id, ...externalChildrenIDs);
  await BackgroundSnakey.emitter.sendToAll(12, {
    id,
    child_ids: externalChildrenIDs
  });
  return {
    id, externalChildrenIDs
  };
}