const crypto = require('crypto');

function encrypt(password) {
  const encryptionAlgorithm = 'aes-128-cbc-hmac-sha1';
  const key = 'Ae58BwN';
  const cipher = crypto.createCipher(encryptionAlgorithm, key);
  let encryptedPassword = cipher.update(password, 'utf8', 'hex');
  encryptedPassword += cipher.final('hex');
  return encryptedPassword;
}

module.exports = encrypt;
