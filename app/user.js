/* global MAXFILESIZE ANON_MAXFILESIZE MAX_EXPIRE_SECONDS ANON_MAX_EXPIRE_SECONDS MAX_DOWNLOADS ANON_MAX_DOWNLOADS  */
const assets = require('../common/assets');

class User {
  constructor(info, storage) {
    if (info && storage) {
      storage.user = info;
    }
    this.storage = storage;
    this.data = info || storage.user || {};
  }

  get avatar() {
    const defaultAvatar = assets.get('user.svg');
    if (this.data.avatarDefault) {
      return defaultAvatar;
    }
    return this.data.avatar || defaultAvatar;
  }

  get name() {
    return this.data.displayName;
  }

  get email() {
    return this.data.email;
  }

  get loggedIn() {
    return !!this.data.access_token;
  }

  get bearerToken() {
    return this.data.access_token;
  }

  get maxSize() {
    return this.loggedIn ? MAXFILESIZE : ANON_MAXFILESIZE;
  }

  get maxExpireSeconds() {
    return this.loggedIn ? MAX_EXPIRE_SECONDS : ANON_MAX_EXPIRE_SECONDS;
  }

  get maxDownloads() {
    return this.loggedIn ? MAX_DOWNLOADS : ANON_MAX_DOWNLOADS;
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
