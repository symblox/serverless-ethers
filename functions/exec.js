const ethers = require("ethers");
const fs = require("fs");
const { abis, addresses } = require("../contracts");
const { ethToVlx } = require("./vlxAddress");
const moment = require("moment");

const tokensName = {
  "0x2de7063fe77aAFB5b401d65E5A108649Ec577170": "SYX",
  "0x4b773e1aE1bAA4894E51cC1D1FAF485C91B1012F": "USDT",
  "0x0000000000000000000000000000000000000000": "VLX"
}

const tokensDecimal = {
  "0x2de7063fe77aAFB5b401d65E5A108649Ec577170": 18,
  "0x4b773e1aE1bAA4894E51cC1D1FAF485C91B1012F": 6,
  "0x0000000000000000000000000000000000000000": 18
}

const usdtPoolId = 3;
const fromBlock = 0;
const toBlock = 4293935;

exports.handler = async function () {
  console.log("Starting...");
  const ConnectorFactoryAbi = abis.ConnectorFactory;
  const ConnectorFactoryAddress = addresses.connectorFactory;
  const ConnectorAbi = abis.BptReferralConnector;

  // Initialize Ethers wallet
  const provider = new ethers.providers.JsonRpcProvider({url:process.env.URL,timeout:300000});
  // Load contract
  const factoryContract = new ethers.Contract(ConnectorFactoryAddress, ConnectorFactoryAbi, provider);

  try {
    const blockNumber = await provider.getBlockNumber();
    console.log(`current block: ${blockNumber}`);
    const curTime = new Date().getTime();
    //const depositWithRefFileName = `./depositWithRef-${curTime}.json`;
    let blocksDate = {};

    const factoryFilter = factoryContract.filters.LogCreateConnector();
    factoryFilter.fromBlock = fromBlock;
    factoryFilter.toBlock = toBlock;

    const createConnectorLogs = await provider.getLogs(factoryFilter);
    let userObj = {};
    let logsToReferral = [],logsDeposit = [], logsWithdraw = [];

    for(let index = 0;index < createConnectorLogs.length;index++){
      const logData = factoryContract.interface.parseLog(createConnectorLogs[index]);
      const contract = new ethers.Contract(logData.args.connector, ConnectorAbi, provider);
      const rewardPoolId = await contract.rewardPoolId();
      if(parseInt(rewardPoolId) == usdtPoolId){
        const refFilter = contract.filters.LogDepositWithReferral();
        refFilter.fromBlock = fromBlock;
        refFilter.toBlock = toBlock;
        const refLogs = await provider.getLogs(refFilter);
        console.log("request ref data:",refLogs.length);
        for(let i=0;i<refLogs.length;i++){
          //console.log(i)
          let parseData = contract.interface.parseLog(refLogs[i]);
          if(!blocksDate[refLogs[i].blockNumber]){
            block = await provider.getBlock(refLogs[i].blockNumber);
            blocksDate[refLogs[i].blockNumber] = moment(block.timestamp * 1000).format("YYYY/MM/DD HH:mm");
          }
          parseData.blockNumber = refLogs[i].blockNumber;
          parseData.date = blocksDate[refLogs[i].blockNumber];
          logsToReferral.push(parseData);
        }
        
        const depositFilter = contract.filters.LogDeposit();
        depositFilter.fromBlock = fromBlock;
        depositFilter.toBlock = toBlock;
        const depositLogs = await provider.getLogs(depositFilter);
        console.log("request deposit data:",depositLogs.length);
        for(let i = 0; i < depositLogs.length;i++){
          //console.log(i)
          const parseData = contract.interface.parseLog(depositLogs[i]);
          if(!blocksDate[depositLogs[i].blockNumber]){
            const block = await provider.getBlock(depositLogs[i].blockNumber);
            blocksDate[depositLogs[i].blockNumber] = moment(block.timestamp * 1000).format("YYYY/MM/DD HH:mm");
          }
          parseData.blockNumber = depositLogs[i].blockNumber;
          parseData.date = blocksDate[depositLogs[i].blockNumber];
          logsDeposit.push(parseData);
        }

        const withdrawFilter = contract.filters.LogWithdrawal();
        withdrawFilter.fromBlock = fromBlock;
        withdrawFilter.toBlock = toBlock;
        const withdrawLogs = await provider.getLogs(withdrawFilter);
        console.log("request withdraw data:",withdrawLogs.length);
        for(let i=0;i<withdrawLogs.length;i++){
          // console.log(i)
          const parseData = contract.interface.parseLog(withdrawLogs[i]);
          if(!blocksDate[withdrawLogs[i].blockNumber]){
            const block = await provider.getBlock(withdrawLogs[i].blockNumber);
            blocksDate[withdrawLogs[i].blockNumber] = moment(block.timestamp * 1000).format("YYYY/MM/DD HH:mm");
          }
          parseData.blockNumber = withdrawLogs[i].blockNumber;
          parseData.date = blocksDate[withdrawLogs[i].blockNumber];
          logsWithdraw.push(parseData);
        }
      } 
    }
    console.log(logsToReferral)
   
    for(let i=0;i<logsToReferral.length;i++){
      const str = `${logsToReferral[i].blockNumber},${logsToReferral[i].date},${ethToVlx(logsToReferral[i].args.dst)},${ethToVlx(logsToReferral[i].args.referral)},${tokensName[logsToReferral[i].args.tokenIn] || logsToReferral[i].args.tokenIn},${logsToReferral[i].args.tokenAmountIn / Number(`1e+${tokensDecimal[logsToReferral[i].args.tokenIn]}`)},${logsToReferral[i].args.poolAmountOut / Number(`1e18`)},,,\n`
      console.log(logsToReferral[i].args.tokenIn, logsToReferral[i].args.tokenAmountIn.toString())
      if(userObj[ethToVlx(logsToReferral[i].args.dst)]){
        userObj[ethToVlx(logsToReferral[i].args.dst)].push(str);
      }else{
        userObj[ethToVlx(logsToReferral[i].args.dst)] = [",块高度,日期,用户,推荐人,存入代币,存入数量,获得bpt数量,取出代币,取出数量,存入bpt数量\n",str];
      }
    }

    for(let i=0;i<logsDeposit.length;i++){
      const str = `${logsDeposit[i].blockNumber},${logsDeposit[i].date},${ethToVlx(logsDeposit[i].args.dst)},,${tokensName[logsDeposit[i].args.tokenIn] || logsDeposit[i].args.tokenIn},${logsDeposit[i].args.tokenAmountIn / Number(`1e+${tokensDecimal[logsDeposit[i].args.tokenIn]}`)},${logsDeposit[i].args.poolAmountOut / Number(`1e18`)},,,\n`
      if(userObj[ethToVlx(logsDeposit[i].args.dst)]){
        userObj[ethToVlx(logsDeposit[i].args.dst)].push(str);
      }
    }

    for(let i=0;i<logsWithdraw.length;i++){
      const str = `${logsWithdraw[i].blockNumber},${logsWithdraw[i].date},${ethToVlx(logsWithdraw[i].args.dst)},,,,,${tokensName[logsWithdraw[i].args.tokenOut] || logsWithdraw[i].args.tokenOut},${logsWithdraw[i].args.tokenAmountOut / Number(`1e+${tokensDecimal[logsWithdraw[i].args.tokenOut]}`)},${logsWithdraw[i].args.poolAmountIn / Number(`1e18`)}\n`
      if(userObj[ethToVlx(logsWithdraw[i].args.dst)]){
        userObj[ethToVlx(logsWithdraw[i].args.dst)].push(str);
      }
    }

    for(let i in userObj){
      fs.writeFile(`./data/${i}-${curTime}.json`, userObj[i], function (err) {
        if (err) console.log(err);
      });
    }    
  } catch (err) {
    console.error(err);
    return err;
  }

  console.log("Completed");
  return true;
};
