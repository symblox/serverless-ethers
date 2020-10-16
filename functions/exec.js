const axios = require("axios");
const ethers = require("ethers");
const fs = require("fs");
const { abis, addresses } = require("../contracts");

const sellSyxAmount = ethers.utils.parseEther("100");
const sellVlxAmount = ethers.utils.parseEther("100");

exports.handler = async function () {
  console.log("Starting...");
  // Load Contract ABIs
  const BPoolABI = abis.BPool;
  const BPoolAddress = addresses.bpt;
  console.log("Contract ABIs loaded");

  // Initialize Ethers wallet
  const provider = new ethers.providers.JsonRpcProvider(process.env.URL);
  // let wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC)
  // wallet = wallet.connect(provider)
  // console.log('Ethers wallet loaded');

  // Load contract
  const contract = new ethers.Contract(BPoolAddress, BPoolABI, provider);
  console.log("Contract loaded");

  console.log("call data...");
  try {
    const blockNumber = await provider.getBlockNumber();
    console.log(`current block: ${blockNumber}`);

    const fileName = "./lastPrice.json";

    let lastPrice;
    if (fs.existsSync(fileName))
        fs.readFile(fileName, function (err, data) {
        if (err) console.log(err);
        lastPrice = data;
    });

    let price = await contract.getSpotPrice(addresses.wvlx, addresses.syx);
    price = price / 10 ** 18;
    console.log(`current price: 1 SYX = ${price} VLX`);

    if(lastPrice){
      const ratio = parseFloat(price) / parseFloat(lastPrice);
      if(ratio > 1.1){
          console.log(`last price: ${lastPrice}, now price: ${price}. increase ${(ratio - 1 )*100}%`)
      }else if(ratio < 0.9){
          console.log(`last price: ${lastPrice}, now price: ${price}. decline ${(1-ratio)*100}%`)
      }
    }

    if (fs.existsSync(fileName))
        fs.unlinkSync(fileName);

    fs.writeFile(fileName, price.toString(), function (err) {
      if (err) console.log(err);
    });

    const wvlxBalance = await contract.getBalance(addresses.wvlx);
    console.log(`wvlx total balance: ${wvlxBalance / 10 ** 18} vlx`);
    const syxBalance = await contract.getBalance(addresses.syx);
    console.log(`syx total balance: ${syxBalance / 10 ** 18} syx`);

    let tokenAmountOut,
      balanceIn,
      denormIn,
      balanceOut,
      denormOut,
      tokenIn,
      tokenOut,
      swapFee;
    tokenIn = addresses.syx;
    tokenOut = addresses.wvlx;
    swapFee = await contract.getSwapFee();
    balanceIn = await contract.getBalance(tokenIn);
    denormIn = await contract.getDenormalizedWeight(tokenIn);
    balanceOut = await contract.getBalance(tokenOut);
    denormOut = await contract.getDenormalizedWeight(tokenOut);

    tokenAmountOut = await contract.calcOutGivenIn(
      balanceIn,
      denormIn,
      balanceOut,
      denormOut,
      sellSyxAmount,
      swapFee
    );

    console.log(
      `sell ${ethers.utils.formatEther(sellSyxAmount)} SYX. price is 1 SYX = ${
        parseFloat(ethers.utils.formatEther(tokenAmountOut)) /
        parseFloat(ethers.utils.formatEther(sellSyxAmount))
      } VLX`
    );

    tokenIn = addresses.wvlx;
    tokenOut = addresses.syx;
    swapFee = await contract.getSwapFee();
    balanceIn = await contract.getBalance(tokenIn);
    denormIn = await contract.getDenormalizedWeight(tokenIn);
    balanceOut = await contract.getBalance(tokenOut);
    denormOut = await contract.getDenormalizedWeight(tokenOut);

    tokenAmountOut = await contract.calcOutGivenIn(
      balanceIn,
      denormIn,
      balanceOut,
      denormOut,
      sellVlxAmount,
      swapFee
    );

    console.log(
      `sell ${ethers.utils.formatEther(sellVlxAmount)} VLX. price is 1 VLX = ${
        parseFloat(ethers.utils.formatEther(tokenAmountOut)) /
        parseFloat(ethers.utils.formatEther(sellVlxAmount))
      } SYX`
    );
  } catch (err) {
    const errorMessage = `:warning: Transaction failed: ${err.message}`;
    console.error(errorMessage);
    await postToSlack(errorMessage);
    return err;
  }

  console.log("Completed");
  return true;
};

function postToSlack(text) {
  const payload = JSON.stringify({
    text,
  });
  return axios.post(process.env.SLACK_HOOK_URL, payload);
}
