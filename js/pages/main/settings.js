let Settings = {
  warn_before_delete: {
    type: "boolean",
    title: i18n('settingTitle_warn_before_delete')
  },
  load_over_http: {
    type: "boolean",
    title: i18n('settingTitle_load_over_http')
  },
  save_settings_after_delete: {
    type: "boolean",
    title: i18n('settingTitle_save_settings_after_delete')
  },
  favicon_service: {
    type: "dropdown",
    title: i18n('settingTitle_favicon_service'),
    description: i18n('settingDesc_favicon_service'),
    options: {
      1: i18n('faviconService1'),
      2: i18n('faviconService2'),
      3: i18n('faviconService3'),
      4: i18n('faviconService4')
    }
  },
  redirect_links: {
    type: "boolean",
    title: i18n('settingTitle_redirect_links'),
    description: i18n('settingDesc_redirect_links')
  },
  redirect_file_links: {
    type: "boolean",
    title: i18n('settingTitle_redirect_file_links'),
    description: i18n('settingDesc_redirect_file_links') + 
      ` <a class="chrome-ext">${i18n('chromeSettings')}</a>`
  },
  enable_js: {
    type: "boolean",
    title: i18n('settingTitle_enable_js'),
    danger: true,
    description: i18n('settingDesc_enable_js')
  },
  debug: {
    type: "boolean",
    title: i18n('settingTitle_debug'),
    danger: true,
    description: i18n('settingDesc_debug'),
  }
}