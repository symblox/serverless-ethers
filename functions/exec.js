const axios = require("axios");
const ethers = require("ethers");
const { abis, addresses } = require("../contracts");

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
    const price = await contract.getSpotPrice(addresses.wvlx, addresses.syx);
    console.log(`current price: 1 SYX = ${price / 10 ** 18} VLX`);
    const wvlxBalance = await contract.getBalance(addresses.wvlx);
    console.log(`wvlx total balance: ${wvlxBalance / 10 ** 18} vlx`);
    const syxBalance = await contract.getBalance(addresses.syx);
    console.log(`syx total balance: ${syxBalance / 10 ** 18} syx`);
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
