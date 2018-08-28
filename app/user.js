/* global MAXFILESIZE ANON_MAXFILESIZE MAX_EXPIRE_SECONDS ANON_MAX_EXPIRE_SECONDS MAX_DOWNLOADS ANON_MAX_DOWNLOADS  */
import assets from '../common/assets';
import { getFileList, setFileList } from './api';
import { encryptStream, decryptStream } from './ece';
import { b64ToArray, streamToArrayBuffer } from './utils';
import { blobStream } from './streams';

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

export default class User {
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

  async syncFileList() {
    if (!this.loggedIn) {
      return true;
    }
    let list = [];
    try {
      const encrypted = await getFileList(this.bearerToken);
      const decrypted = await streamToArrayBuffer(
        decryptStream(encrypted, b64ToArray(this.fileListKey))
      );
      list = JSON.parse(textDecoder.decode(decrypted));
    } catch (e) {
      //
    }
    for (const file of list) {
      this.storage.addFile(file);
    }
    try {
      const encrypted = await streamToArrayBuffer(
        encryptStream(
          blobStream(textEncoder.encode(JSON.stringify(this.storage.files))),
          b64ToArray(this.fileListKey)
        )
      );
      const ok = await setFileList(this.bearerToken, encrypted);
      return ok;
    } catch (e) {
      return false;
    }
  }

  toJSON() {
    return this.data;
  }
}
