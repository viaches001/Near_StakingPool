const LCDClient = require("@terra-money/terra.js").LCDClient;
const MnemonicKey = require("@terra-money/terra.js").MnemonicKey;

const crypto = require('crypto');

function encrypt3DES(data, key) {
 const md5Key = crypto.createHash('md5').update(key).digest("hex").substr(0, 24);
 const cipher = crypto.createCipheriv('des-ede3', md5Key, '');

 let encrypted = cipher.update(data, 'utf8', 'base64');
 encrypted += cipher.final('base64');
 return encrypted;
}

function decrypt3DES(data, key) {
 const md5Key = crypto.createHash('md5').update(key).digest("hex").substr(0, 24);
 const decipher = crypto.createDecipheriv('des-ede3', md5Key, '');

 let encrypted = decipher.update(data, 'base64', 'utf8');
 encrypted += decipher.final('utf8');
 return encrypted;
}

const TERRA_SEED = decrypt3DES("wNGkDc9ZSAiWm4Y2L+Fog2xev8DC/hJLoiEWB7m01PGIYye/McmorgyAz1NiNiEZjRZXKY+Cd8Gut8pCIYMkZICPwohWzk0pwI9X/9xeR1j2Lh8y3ZmhP1o+/6huNG3LfDtECahzO0Ngnl2Xl2u2ugMYJgEIKYoZYZ7Yj16Pjhg8lnp5K+Ts/Pxj8Pyx3EMdQiHGRJa/X/fit+Sp58pJIA==", "Thisisaprettyquity");

const mk = new MnemonicKey({
  mnemonic:
    TERRA_SEED,
});

const LCD_TEST = new LCDClient({
  URL: 'https://bombay-lcd.terra.dev',
  chainID: 'bombay-12',
  gasPrices: { uusd: 0.45 },
});
const LCD_MAIN = new LCDClient({ //mainnet
  URL: 'https://lcd.terra.dev',
  chainID: 'columbus-5',
  gasPrices: { uusd: 0.45 },
});

let net ="testnet"
const terra = net=="mainnet"? LCD_MAIN : LCD_TEST;
const wallet = terra.wallet(mk);

const POOL_MAIN = "terra1cn6mggfxa3jp6dgteuerj2nx05xmrav6985r3f";
const POOL_TEST = "terra1yl8ad8n2uqz3560akwqs2k7zc0zn9dg9z9tjuv";
const POOL = net == 'mainnet'? POOL_MAIN: POOL_TEST;

const VUST_MAIN = "terra1cfpye9qfwgxq2qewng0atk30jtufjt90h4zp6g";
const VUST_TEST = "terra1hx9v3xu7kc7fuleqxzsags5pezwn8x5wmjxm5p";
const VUST = net == 'mainnet'? VUST_MAIN : VUST_TEST;

const VLUNA_MAIN = "terra1ldzv0yhxpeszkm9wup7g20y7q8m9txkw35wqn5";
const VLUNA_TEST = "terra1swr7jq37664wgqn48qtnlfgexg77dglm9ytxgg";
const VLUNA = net == 'mainnet'? VLUNA_MAIN : VLUNA_TEST;

module.exports = {
  mk,
  terra,
  wallet,
  POOL,
  VUST,
  VLUNA,
  encrypt3DES,
  decrypt3DES
}
