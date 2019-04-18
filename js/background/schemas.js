BackgroundSnakey.Schemas = {
  Style: Joi.object().keys({
    manifest_ver: Joi.any().only(1).required(),
    style_type: Joi.any().only("style").required(),
    name: Joi.string().min(3).max(50).required(),
    author: Joi.string().min(3).max(50).required(),
    description: Joi.string().max(200),
    id: Joi.string().regex(/^[a-z0-9]{3,20}\.[a-z0-9]{3,20}$/).required(),
    version: Joi.semver().valid().required(),
    tags: Joi.array().items(Joi.string().lowercase().token().min(2).max(20)).min(1),
    css_link: Joi.string().uri(),
    js_link: Joi.string().uri(),
    homepage: Joi.string().uri(),
    urls: Joi.array().items(Joi.string().regex(Constants.URLRegex)).required(),
    simple_url: Joi.string().regex(/^([a-z0-9]{1,20}\.)*[a-z0-9]{1,20}\.[a-z0-9]{2,10}$/),
    builtin_components: Joi.object().min(1),
    settings: Joi.object().min(1)
  }).xor('css_link', 'js_link'),
  BuiltInComponent: Joi.object().keys({
    name: Joi.string().min(3).max(50).required(),
    author: Joi.string().min(3).max(50),
    description: Joi.string().max(200),
    id: Joi.string().forbidden(),
    version: Joi.semver().valid().required(),
    css_link: Joi.string().uri(),
    js_link: Joi.string().uri(),
    default: Joi.boolean(),
    settings: Joi.object().min(1)
  }).xor('css_link', 'js_link'),
  Component: Joi.object().keys({
    manifest_ver: Joi.any().only(1).required(),
    style_type: Joi.any().only("component").required(),
    name: Joi.string().min(3).max(50).required(),
    author: Joi.string().min(3).max(50).required(),
    description: Joi.string().max(200),
    parent_id: Joi.string().regex(/^[a-z0-9]{3,20}\.[a-z0-9]{3,20}$/).required(),
    id: Joi.string().regex(/^[a-z0-9]{3,20}$/).required(),
    version: Joi.semver().valid().required(),
    tags: Joi.array().items(Joi.string().lowercase().token().min(2).max(20)).min(1),
    css_link: Joi.string().uri(),
    js_link: Joi.string().uri(),
    homepage: Joi.string().uri(),
    settings: Joi.object().min(1)
  }).xor('css_link', 'js_link')
}

BackgroundSnakey.SettingsSchemas = {
  _create(obj) {
    let base = {
      type: Joi.string().lowercase().required(),
      title: Joi.string().min(1).max(100).required(),
      default: Joi.any().required(),
      description: Joi.string().min(1).max(200),
      danger: Joi.boolean()
    };
    Util.objectForEach(obj, (k, v) => base[k] = v);
    return base;
  }
}
BackgroundSnakey.SettingsSchemas.TEXT = Joi.object().keys(
  BackgroundSnakey.SettingsSchemas._create({
    type: Joi.any().only("text").required(),
    default: Joi.string().required(),
    url: Joi.boolean(),
    quotes: Joi.boolean()
  })
)

BackgroundSnakey.SettingsSchemas.BOOLEAN = Joi.object().keys(
  BackgroundSnakey.SettingsSchemas._create({
    type: Joi.any().only("boolean").required(),
    default: Joi.boolean().required(),
    if_true: Joi.boolean(),
    if_false: Joi.boolean()
  })
)

BackgroundSnakey.SettingsSchemas.NUMBER = Joi.object().keys(
  BackgroundSnakey.SettingsSchemas._create({
    type: Joi.any().only("number").required(),
    default: Joi.number().required(),
    suffix: Joi.string().max(5)
  })
)

BackgroundSnakey.SettingsSchemas.DROPDOWN = Joi.object().keys(
  BackgroundSnakey.SettingsSchemas._create({
    type: Joi.any().only("dropdown").required(),
    default: Joi.string(),
    options: Joi.object().min(1)
  })
)