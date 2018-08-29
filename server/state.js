const config = require('./config');
const layout = require('./layout');
const locales = require('../common/locales');
const assets = require('../common/assets');

module.exports = function(req) {
  const locale = req.language || 'en-US';
  const userInfo = req.userInfo || { avatar: assets.get('user.svg') };
  userInfo.loggedIn = !!userInfo.access_token;
  return {
    locale,
    translate: locales.getTranslator(locale),
    title: 'Firefox Send',
    description:
      'Encrypt and send files with a link that automatically expires to ensure your important documents don’t stay online forever.',
    baseUrl: config.base_url,
    ui: {},
    storage: {
      files: []
    },
    fira: false,
    fileInfo: {},
    cspNonce: req.cspNonce,
    user: userInfo,
    layout
  };
};
