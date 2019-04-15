class ValidationError extends Error {
  constructor(errorName, data, params = []) {
    let message = i18n("error_" + errorName.toLowerCase(), params);
    super(message);
    this.ok = false;
    this.message = this.messageText = message;
    this.data = data;
    this.errorName = errorName;
    console.warn('Validation Error Contructed', this)
  }

  addToData(data) {
    Object.assign(this.data, data);
    return this;
  }

  get json() {
    return {
      ok: false,
      message: this.message,
      data: this.data
    }
  }

  get _isValidationError() {
    return true;
  }
}

BackgroundSnakey.Validator = {};

BackgroundSnakey.Validator.validate = async function(style, { dry = false, fetchURL = null } = {}) {
  if(!style)
    return new ValidationError("NONEXISTANT", { object: style });
  if(!Constants.StyleTypes.includes(style.style_type))
    return new ValidationError(
      "INVALID_STYLE_TYPE",
      { style },
      [ style.style_type ]
    );
  
  let styleToSchema = {
    style: "validateStyle",
    component: "validateComponent"
  }
  return BackgroundSnakey.Validator[styleToSchema[style.style_type]](style, { dry, fetchURL });
}

BackgroundSnakey.Validator.validateWithURL = async function(url, { dry = false }) {
  console.log("Fetching style from URL", { url });
  let evaluation = await BackgroundSnakey.Validator.validateURL(url);
  if(!evaluation.ok) return evaluation;
  try {
    let style = JSON.parse(evaluation.text);
    return BackgroundSnakey.Validator.validate(style, { dry, fetchURL: url });
  } catch (e) {
    return new ValidationError(
      "JSON_PARSE",
      { text: evaluation.text, error: e },
      [ e.toString() ]
    );
  }
}

BackgroundSnakey.Validator.validateStyle = async function(style, { dry = false, fetchURL = null } = {}) {
  if(!style)
    return new ValidationError("NONEXISTANT", { object: style });
  
  console.log("Starting evaluation with schema", { type: 1, style });
  let evaluation = BackgroundSnakey.Schemas.Style.validate(style);
  if(evaluation.error !== null)
    return new ValidationError(
      "SCHEMA_FAIL",
      { style, error: evaluation.error },
      [ evaluation.error.toString() ]
    );

  let components = null;
  if(style.builtin_components) {
    console.log("Starting component evaluation", { style });
    promises = [];
    Util.objectForEach(style.builtin_components, async (id, component) => {
      if(!id.match(/^[a-z0-9]{3,20}$/))
        return promises.push(Promise.resolve(new ValidationError(
          "BAD_COMPONENT_KEY",
          { id, component },
          [ id ]
        )));
      promises.push(BackgroundSnakey.Validator.validateComponent(component, { built_in: true, parent_style: style, id }));
    });
    components = await Promise.all(promises);
    let bad_components = components.filter(result => !result.ok);
    
    if(bad_components.length !== 0)
    return new ValidationError(
      "BUILTIN_COMPONENT_FAIL",
      { style, bad_components },
      [ bad_components.length ]
    );
  }

  if(style.settings) {
    let settingsEvaluation = BackgroundSnakey.Validator.validateSettings(style.settings);
    if(!settingsEvaluation.ok) return settingsEvaluation;
  }

  // Attach URL to involve future updates, do not use data URIs
  if(fetchURL && !fetchURL.match(/^data:\w+\/[\w-]+;base64,/)) style.fetch_url = fetchURL;
  if(!dry) return await BackgroundSnakey.Validator.validateFetching(style, { components });

  return {
    ok: true,
    style,
    components
  }
}

BackgroundSnakey.Validator.validateComponent = async function(component, { dry = false, built_in = false, parent_style = null, id = null, fetchURL = null } = {}) {
  if(!component)
    return new ValidationError("NONEXISTANT", { object: component });
  
  console.log("Starting evaluation with schema", { type: 2, component, built_in });
  let evaluation = BackgroundSnakey.Schemas[
    built_in ? "BuiltInComponent" : "Component"
  ].validate(component);

  if(evaluation.error !== null)
    return new ValidationError(
      "SCHEMA_FAIL",
      { component, parent_style, error: evaluation.error, id },
      [ evaluation.error.toString() ]
    );

  if(component.settings) {
    let settingsEvaluation = BackgroundSnakey.Validator.validateSettings(component.settings);
    if(!settingsEvaluation.ok) return settingsEvaluation;
  }

  if(fetchURL && !fetchURL.match(/^data:\w+\/[\w-]+;base64,/)) component.fetch_url = fetchURL;
  if(!dry) return await BackgroundSnakey.Validator.validateFetching(component, { id });

  return {
    ok: true,
    style: component,
    id
  }
}

BackgroundSnakey.Validator.validateFetching = async function(style, { components = null, id = null } = {}) {
  console.log("Starting fetching validation", { style });
  let result = {
    ok: true,
    id,
    style,
    components
  };
  if(style.css_link) {
    let cssURLEvaluation = await BackgroundSnakey.Validator.validateURL(style.css_link);
    if(!cssURLEvaluation.ok) return cssURLEvaluation.addToData({ style });
    result.css = cssURLEvaluation.text;
  }
  if(style.js_link) {
    let jsURLEvaluation = await BackgroundSnakey.Validator.validateURL(style.js_link);
    if(!jsURLEvaluation.ok) return jsURLEvaluation.addToData({ style });
    result.js = jsURLEvaluation.js;
  }
  let cssEvaluation = BackgroundSnakey.Validator.validateCSS(result.css);
  if(!cssEvaluation.ok) return cssEvaluation;
  // TODO: validate js somehow?
  return result;
}

BackgroundSnakey.Validator.validateSettings = function(settings) {
  let fails = [];
  Util.objectForEach(settings, async (key, setting) => {
    if(!key.match(/^[a-zA-Z0-9\-]+$/))
      return fails.push(new ValidationError(
        "BAD_SETTINGS_KEY",
        { id, component },
        [ id ]
      ));
    let schema = BackgroundSnakey.SettingsSchemas[setting.type.toUpperCase()];
    if(!schema)
      return fails.push(new ValidationError(
        "BAD_SETTINGS_TYPE",
        { id, component },
        [ id ]
      ));
    console.log("Starting settings evaluation with schema", { settings, setting });
    let evaluation = schema.validate(setting);
    if(evaluation.error !== null)
      return fails.push(new ValidationError(
        "SCHEMA_FAIL",
        { setting, error: evaluation.error },
        [ evaluation.error.toString() ]
      ));
  });

  if(fails.length !== 0)
    return new ValidationError(
      "SETTINGS_FAIL",
      { settings, fails },
      [ fails.length ]
    );
  return { ok: true }
}

BackgroundSnakey.Validator.validateURL = async function(url) {
  console.log("Fetching URL", { url });
  let response = await fetch(url);
  let text = await response.text();
  console.log("Finshed fetching URL", { url, response, text });
  if(response.status > 299) {
    return new ValidationError(
      "FETCH_FAIL",
      { 
        url,
        status: response.status,
        statusText: response.statusText,
        text
      },
      [
        response.status
      ]
    );
  }
  return {
    ok: true,
    status: response.status,
    statusText: response.statusText,
    text
  }
}

BackgroundSnakey.Validator.validateCSS = function(css) {
  let evaluation = Snakey.css.check(css);
  console.log("Validating CSS", { css, evaluation });
  if(evaluation.ok) return { ok: true };
  return new ValidationError(
    "CSS_PARSER",
    { errors: evaluation.errors },
    [ evaluation.errors.length ]
  );
}