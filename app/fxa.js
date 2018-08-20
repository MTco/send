import jose from 'node-jose';

export async function prepareWrapKey(storage) {
  const keystore = jose.JWK.createKeyStore();
  const keypair = await keystore.generate('EC', 'P-256');
  storage.set('fxaWrapKey', JSON.stringify(keystore.toJSON(true)));
  return jose.util.base64url.encode(JSON.stringify(keypair.toJSON()));
}

export async function decryptBundle(storage, bundle) {
  const keystore = await jose.JWK.asKeyStore(
    JSON.parse(storage.get('fxaWrapKey'))
  );
  const result = await jose.JWE.createDecrypt(keystore).decrypt(bundle);
  return JSON.parse(jose.util.utf8.encode(result.plaintext));
}
