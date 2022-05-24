
// const crypto = require('crypto');

// function encrypt3DES(data, key) {
//  const md5Key = crypto.createHash('md5').update(key).digest("hex").substr(0, 24);
//  const cipher = crypto.createCipheriv('des-ede3', md5Key, '');

//  let encrypted = cipher.update(data, 'utf8', 'base64');
//  encrypted += cipher.final('base64');
//  return encrypted;
// }

// function decrypt3DES(data, key) {
//  const md5Key = crypto.createHash('md5').update(key).digest("hex").substr(0, 24);
//  const decipher = crypto.createDecipheriv('des-ede3', md5Key, '');

//  let encrypted = decipher.update(data, 'base64', 'utf8');
//  encrypted += decipher.final('utf8');
//  return encrypted;
// }

// const TERRA_SEED = decrypt3DES("wNGkDc9ZSAiWm4Y2L+Fog2xev8DC/hJLoiEWB7m01PGIYye/McmorgyAz1NiNiEZjRZXKY+Cd8Gut8pCIYMkZICPwohWzk0pwI9X/9xeR1j2Lh8y3ZmhP1o+/6huNG3LfDtECahzO0Ngnl2Xl2u2ugMYJgEIKYoZYZ7Yj16Pjhg8lnp5K+Ts/Pxj8Pyx3EMdQiHGRJa/X/fit+Sp58pJIA==", "Thisisaprettyquity");

// const mk = new MnemonicKey({
//   mnemonic:
//     TERRA_SEED,
// });

// const LCD_TEST = new LCDClient({
//   URL: 'https://bombay-lcd.terra.dev',
//   chainID: 'bombay-12',
//   gasPrices: { uusd: 0.45 },
// });
// const LCD_MAIN = new LCDClient({ //mainnet
//   URL: 'https://lcd.terra.dev',
//   chainID: 'columbus-5',
//   gasPrices: { uusd: 0.45 },
// });

let net ="testnet"
// const terra = net=="mainnet"? LCD_MAIN : LCD_TEST;
// const wallet = terra.wallet(mk);

const POOL_MAIN = "=";
const POOL_TEST = "staking_voucher_tokens.testnet";
const POOL = net == 'mainnet'? POOL_MAIN: POOL_TEST;

function getConfig(env) {
  switch(env) {
    case 'mainnet':
      return {
        networkId: 'mainnet',
        nodeUrl: 'https://rpc.mainnet.near.org',
        contractName: POOL,
        walletUrl: 'https://wallet.near.org',
        helperUrl: 'https://helper.mainnet.near.org'
      };
    // This is an example app so production is set to testnet.
    // You can move production to mainnet if that is applicable.
    case 'production':
    case 'development':
    case 'testnet':
      return {
        networkId: 'testnet',
        nodeUrl: 'https://rpc.testnet.near.org',
        contractName: POOL,
        walletUrl: 'https://wallet.testnet.near.org',
        helperUrl: 'https://helper.testnet.near.org'
      };
    default:
      throw Error(`Unconfigured environment '${env}'. Can be configured in src/config.js.`);
  }
}

// module.exports = {
//   mk,
//   terra,
//   wallet,
//   POOL,
//   VUST,
//   VLUNA,
//   encrypt3DES,
//   decrypt3DES
// }

module.exports = {
  POOL,
  nearConfig: getConfig(net)
}
