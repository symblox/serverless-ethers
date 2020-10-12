const axios = require("axios");
const ethers = require("ethers");
const { abis, addresses } = require("../contracts");

const sellSyxAmount = ethers.utils.parseEther("1");
const sellVlxAmount = ethers.utils.parseEther("1");

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

    let tokenAmountIn,
      tokenAmountOut,
      spotPrice,
      tokenBalanceIn,
      tokenBalanceOut,
      balanceIn,
      denormIn,
      balanceOut,
      denormOut,
      tokenIn,
      tokenOut,
      swapFee;
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
      sellSyxAmount.toString(),
      swapFee
    );

    tokenBalanceIn =
      parseFloat(ethers.utils.formatEther(balanceIn).toString()) +
      parseFloat(ethers.utils.formatEther(sellSyxAmount).toString());
    tokenBalanceOut =
      parseFloat(ethers.utils.formatEther(balanceOut).toString()) -
      parseFloat(ethers.utils.formatEther(tokenAmountOut).toString());
    // console.log(tokenIn, tokenOut);
    // console.log(
    //   parseFloat(ethers.utils.formatEther(balanceIn).toString()),
    //   parseFloat(ethers.utils.formatEther(sellVlxAmount).toString())
    // );
    // console.log(
    //   parseFloat(ethers.utils.formatEther(balanceOut).toString()),
    //   parseFloat(ethers.utils.formatEther(tokenAmountOut).toString())
    // );
    spotPrice = await contract.calcSpotPrice(
      ethers.utils.parseEther(tokenBalanceIn.toString()),
      denormIn,
      ethers.utils.parseEther(tokenBalanceOut.toString()),
      denormOut,
      swapFee
    );

    console.log(
      `sell ${ethers.utils.formatEther(
        sellSyxAmount
      )} SYX. price is 1 SYX = ${ethers.utils.formatEther(spotPrice)} VLX`
    );

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
      sellVlxAmount.toString(),
      swapFee
    );

    tokenBalanceIn =
      parseFloat(ethers.utils.formatEther(balanceIn).toString()) +
      parseFloat(ethers.utils.formatEther(sellVlxAmount).toString());
    tokenBalanceOut =
      parseFloat(ethers.utils.formatEther(balanceOut).toString()) -
      parseFloat(ethers.utils.formatEther(tokenAmountOut).toString());

    // console.log(tokenIn, tokenOut);
    // console.log(
    //   parseFloat(ethers.utils.formatEther(balanceIn).toString()),
    //   parseFloat(ethers.utils.formatEther(sellVlxAmount).toString())
    // );
    // console.log(
    //   parseFloat(ethers.utils.formatEther(balanceOut).toString()),
    //   parseFloat(ethers.utils.formatEther(tokenAmountOut).toString())
    // );
    spotPrice = await contract.calcSpotPrice(
      ethers.utils.parseEther(tokenBalanceIn.toString()),
      denormIn,
      ethers.utils.parseEther(tokenBalanceOut.toString()),
      denormOut,
      swapFee
    );

    console.log(
      `sell ${ethers.utils.formatEther(
        sellVlxAmount
      )} VLX. price is 1 VLX = ${ethers.utils.formatEther(spotPrice)} SYX`
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
