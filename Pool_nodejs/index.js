
const LCDClient = require("@terra-money/terra.js").LCDClient;
const MnemonicKey = require("@terra-money/terra.js").MnemonicKey;
const MsgExecuteContract = require("@terra-money/terra.js").MsgExecuteContract;
const MsgSend = require("@terra-money/terra.js").MsgSend;
const Fee = require("@terra-money/terra.js").Fee;
const axios = require('axios');

const mk = require("./constants").mk;
const terra = require("./constants").terra;
const wallet = require("./constants").wallet;
const poolAddress = require("./constants").POOL;
const vustAddress = require("./constants").VUST;
const vlunaAddress = require("./constants").VLUNA;

const encrypt3DES = require("./constants").encrypt3DES;
const decrypt3DES = require("./constants").decrypt3DES;

const port = process.env.PORT || 3001
const express = require("express");
const app = express();
const cors = require("cors");
const fs = require('fs');
const path = require("path")
var formidable = require('formidable');

app.use(express.json());
app.use(cors());

// const args = process.argv.slice(2)

// let encrypt = encrypt3DES(args[0], "Thisisaprettyquity");
// console.log(encrypt);

// let decrypt = decrypt3DES(encrypt, "Thisisaprettyquity");
// console.log(decrypt);

async function withdraw(sender, amount, coinType) {
  try {
    lunaInfo = await axios.get(
      `https://api.extraterrestrial.money/v1/api/prices?symbol=LUNA`
    );
  } catch (e) { }

  try {
    ustInfo = await axios.get(
      `https://api.extraterrestrial.money/v1/api/prices?symbol=UST`
    );
  } catch (e) { }
  const ustPrice = ustInfo ? ustInfo?.data.prices.UST.price : 1;
  const lunaPrice = lunaInfo ? lunaInfo?.data.prices.LUNA.price : 100;

  let withdraw_msg
  if (coinType == 'luna')
    withdraw_msg = {
      "withdraw_luna": {
        "wallet": sender,
        "ust_price": parseInt(ustPrice * 100).toString(),
        "luna_price": parseInt(lunaPrice * 100).toString()
      }
    };
  else {
    withdraw_msg = {
      "withdraw_ust": {
        "wallet": sender,
        "ust_price": parseInt(ustPrice * 100).toString(),
        "luna_price": parseInt(lunaPrice * 100).toString()
      }
    };
  }

  let buff = new Buffer.from(JSON.stringify(withdraw_msg));
  let base64data = buff.toString('base64');

  let msg = {
    "send_from": {
      "owner": sender,
      "contract": poolAddress,
      "amount": amount,
      "msg": base64data,
    }
  }

  console.log(msg);
  const transfer_msg = new MsgExecuteContract(
    mk.accAddress,
    coinType == 'luna' ? vlunaAddress : vustAddress,
    msg,
    {}
  )

  const bank_msg = new MsgSend(
    mk.accAddress,
    sender,
    coinType == 'luna' ? { uluna: amount } : {uusd: amount}
  );

  let res = await EstimateSend([transfer_msg, bank_msg], "withdraw");
  if (res == "success")
    console.log("withdraw success");
  else
    console.log("withdraw failed")
  return res;
}

app.post("/withdraw", async function (req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields, files) {
    console.log(fields.wallet);
    console.log(fields.coinType);
    console.log(fields.amount);

    let count = 0;
    let result;
    do {
      result = await withdraw(fields.wallet, fields.amount, fields.coinType);
      console.log(result);
      await sleep(1000);
      count++;
    } while (result != 'success' && count < 10)

    if (result == 'success') {
      res.status(200).jsonp({
        data: "success"
      });
    } else{
      res.status(500).jsonp({
        data: result
      })
    }
  })
});


async function payReward() {
  let msg_ust = {
    "rewards_ust": {
    }
  };

  const reward_ust = new MsgExecuteContract(
    mk.accAddress,
    poolAddress,
    msg_ust,
    {}
  )

  let msg_luna = {
    "rewards_luna": {
    }
  };

  const reward_luna = new MsgExecuteContract(
    mk.accAddress,
    poolAddress,
    msg_luna,
    {}
  )

  let res = await EstimateSend([reward_ust, reward_luna], "reward");
  if (res == "success") console.log("reward success");
  else console.log("reward failed");
  return res;
}


async function farm() {
  try {
    lunaInfo = await axios.get(
      `https://api.extraterrestrial.money/v1/api/prices?symbol=LUNA`
    );
  } catch (e) { }

  try {
    ustInfo = await axios.get(
      `https://api.extraterrestrial.money/v1/api/prices?symbol=UST`
    );
  } catch (e) { }
  const ustPrice = ustInfo ? ustInfo?.data.prices.UST.price : 1;
  const lunaPrice = lunaInfo ? lunaInfo?.data.prices.LUNA.price : 100;

  let msg_farm = {
    "farm": {
      "ust_price": parseInt(ustPrice * 100).toString(),
      "luna_price": parseInt(lunaPrice * 100).toString()
    }
  };

  const farm = new MsgExecuteContract(
    mk.accAddress,
    poolAddress,
    msg_farm,
    {}
  )

  let res = await EstimateSend([farm], "farm");
  if (res == "success") console.log("farm suceess");
  else console.log("farm failed");
  return res;
}

const nodeCron = require("node-cron");
var job = nodeCron.schedule('0 0 0-23 * * *', async function () {
  console.log("pay reward start")
  let res = 'success';
  let count = 0;
  do {
    res = await payReward();
    await sleep(6000);
    count++;
  } while (res != 'success' && count < 10)

  console.log("community farm start")
  res = 'success';
  count = 0;
  do {
    res = await farm();
    await sleep(6000);
    count++;
  } while (res != 'success' && count < 10)
});


async function potProcess() {
  let msg_pot = {
    "pot_process": {}
  };

  const pot = new MsgExecuteContract(
    mk.accAddress,
    poolAddress,
    msg_pot,
    {}
  )

  let res = await EstimateSend([pot], "pot_process");
  if (res == "success") console.log("pot process suceess");
  else console.log("port process failed");
  return res;
}

var job2 = nodeCron.schedule('0 59 * * * *', async function () {//s m h day month dayOfweek
  console.log("Pot process start")
  let res = 'success';
  let count = 0;
  do {
    res = await potProcess();
    await sleep(6000);
    count++;
  } while (res != 'success' && count < 10)
});


app.get('/', (req, res) => res.send("success v19"))

app.listen(port, () => console.log(`Server listening on port ${port}!`))


function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function EstimateSend(msgs, memo) {
  try {
    const obj = new Fee(10_000, { uusd: 4500 });
    let accountInfo;

    await terra.auth.accountInfo(
      mk.accAddress
    )
      .then((e) => {
        accountInfo = e;
      })

    let txOptions =
    {
      msgs: msgs,
      memo: memo,
      gasPrices: obj.gasPrices(),
      gasAdjustment: 1.7,
    };

    let rawFee;
    await terra.tx.estimateFee(
      [
        {
          sequenceNumber: accountInfo.getSequenceNumber(),
          publicKey: accountInfo.getPublicKey(),
        },
      ],
      txOptions
    )
      .then((e) => {
        rawFee = e;
      })

    const res = await wallet
      .createAndSignTx({
        msgs: msgs,
        memo: memo,
        fee: rawFee,
        gasPrice: obj.gasPrices(),
        gasAdjustment: 1.7,
      })
      .then((tx) => terra.tx.broadcast(tx))

    return "success";
  }
  catch (e) {
    return e.response.data;
  }
}

