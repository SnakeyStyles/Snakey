let Constants = {
  ListenerActions: {
    STYLE_ADDED:             11,
    STYLE_REMOVED:           12,
    STYLE_CHANGED:           13,
    STYLE_SETTINGS_CHANGED:  14,
    STYLE_ADD:               15,
    STYLE_REMOVE:            16,
    STYLE_CHANGE:            17,
    STYLE_SETTINGS_CHANGE:   18,
    SNAKEY_SETTINGS_CHANGED: 23,
    SNAKEY_SETTINGS_CHANGE:  28,
    REQUEST_RESPONSE:        1000,
    DRY_RUN_STYLE:           1001,
    REPLACE_TAB:             1002
  },
  UnsupportedProtocols: {
    about: 'chromeAbout',
    'chrome-extension': 'chromeExtension',
    chrome: 'chromePage',
    file: 'localFile',
    ftp: 'ftpPage',
    'view-source': 'viewSourcePage'
  },
  URLRegex: /^(.*:)\/\/([A-Za-z0-9\-\.]+)(:[0-9]+)?(.*)$/,
  Versions: {
    Data: 1,
    Settings: 1,
    Manifest: 1
  },
  StyleTypes: [
    'style',
    'component'
  ]
}