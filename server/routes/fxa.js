const { URLSearchParams } = require('url');
const fetch = require('node-fetch');
const config = require('../config');
const pages = require('./pages');

let fxaConfig = null;

async function getFxaConfig() {
  if (fxaConfig) {
    return fxaConfig;
  }
  const res = await fetch(`${config.fxa_url}/.well-known/openid-configuration`);
  fxaConfig = await res.json();
  return fxaConfig;
}

module.exports = {
  login: async function(req, res) {
    const c = await getFxaConfig();
    const params = new URLSearchParams({
      client_id: config.fxa_client_id,
      redirect_uri: `${config.base_url}/api/fxa/oauth`,
      state: 'todo',
      scope: 'profile openid',
      action: 'email'
    });
    res.redirect(`${c.authorization_endpoint}?${params.toString()}`);
  },

  oauth: async function(req, res) {
    const query = req.query;
    if (!query || !query.code || !query.state || !query.action) {
      return res.sendStatus(400);
    }
    const c = await getFxaConfig();
    const x = await fetch(c.token_endpoint, {
      method: 'POST',
      body: JSON.stringify({
        code: query.code,
        client_id: config.fxa_client_id,
        client_secret: config.fxa_client_secret
      }),
      headers: {
        'content-type': 'application/json'
      }
    });
    const zzz = await x.json();
    // console.error(zzz);
    const p = await fetch(c.userinfo_endpoint, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${zzz.access_token}`
      }
    });
    const userInfo = await p.json();
    req.userInfo = userInfo;
    pages.index(req, res);
  }
};
