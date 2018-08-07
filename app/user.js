const assets = require('../common/assets');
// In dev assets aren't populated at require time...
let DEFAULT_AVATAR = assets.get('user.svg');

class User {
  constructor(info, storage) {
    if (DEFAULT_AVATAR === 'undefined') {
      DEFAULT_AVATAR = assets.get('user.svg');
    }
    if (info && storage) {
      storage.user = info;
    }
    this.storage = storage;
    this.data = info || storage.user || {};
  }

  get avatar() {
    if (this.data.avatarDefault) {
      return DEFAULT_AVATAR;
    }
    return this.data.avatar || DEFAULT_AVATAR;
  }

  get name() {
    return this.data.displayName;
  }

  get email() {
    return this.data.email;
  }

  get loggedIn() {
    return !!this.data.uid;
  }

  login() {}

  logout() {
    this.storage.user = null;
    this.data = {};
  }

  toJSON() {
    return this.data;
  }
}

module.exports = User;
