const ethers = require("ethers");
const fs = require("fs");
const { abis, addresses } = require("../contracts");

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

    const factoryFilter = factoryContract.filters.LogCreateConnector();
    factoryFilter.fromBlock = 0;

    const createConnectorLogs = await provider.getLogs(factoryFilter);
    let logsToReferral = [],logsDeposit = [], logsWithdraw = [];
    const logsPromises = createConnectorLogs.map(async (log) => {
      const logData = factoryContract.interface.parseLog(log);
      const contract = new ethers.Contract(logData.args.connector, ConnectorAbi, provider);
      const refFilter = contract.filters.LogDepositWithReferral();
      refFilter.fromBlock = 0;
      const refLogs = await provider.getLogs(refFilter);
      for(let i = 0; i<refLogs.length;i++){
        const parseData = contract.interface.parseLog(refLogs[i]);
        parseData.blockNumber = refLogs[i].blockNumber;
        logsToReferral.push(parseData)
      }
      
      const depositFilter = contract.filters.LogDeposit();
      depositFilter.fromBlock = 0;
      const depositLogs = await provider.getLogs(depositFilter);
      for(let i = 0; i<depositLogs.length;i++){
        const parseData = contract.interface.parseLog(depositLogs[i]);
        parseData.blockNumber = depositLogs[i].blockNumber;
        logsDeposit.push(parseData)
      } 

      const withdrawFilter = contract.filters.LogWithdrawal();
      withdrawFilter.fromBlock = 0;
      const withdrawLogs = await provider.getLogs(withdrawFilter);
      for(let i = 0; i<withdrawLogs.length;i++){
        const parseData = contract.interface.parseLog(withdrawLogs[i]);
        parseData.blockNumber = withdrawLogs[i].blockNumber;
        logsWithdraw.push(parseData)
      }  
    })
    await Promise.all(logsPromises);
   
    for(let i=0;i<logsToReferral.length;i++){
      if(logsToReferral[i].args.dst!=logsToReferral[i].args.referral){
        console.log(`
blockNumber: ${logsToReferral[i].blockNumber}
dst: ${logsToReferral[i].args.dst}
referral: ${logsToReferral[i].args.referral}
tokenIn: ${logsToReferral[i].args.tokenIn}
tokenAmountIn: ${logsToReferral[i].args.tokenAmountIn.toString()}
poolAmountOut: ${logsToReferral[i].args.poolAmountOut.toString()}
        `)
      }
    }

    for(let i=0;i<logsDeposit.length;i++){
      console.log(`
blockNumber: ${logsDeposit[i].blockNumber}
dst: ${logsDeposit[i].args.dst}
tokenIn: ${logsDeposit[i].args.tokenIn}
tokenAmountIn: ${logsDeposit[i].args.tokenAmountIn.toString()}
poolAmountOut: ${logsDeposit[i].args.poolAmountOut.toString()}
        `)
    }

    for(let i=0;i<logsWithdraw.length;i++){
      console.log(`
blockNumber: ${logsWithdraw[i].blockNumber}
dst: ${logsWithdraw[i].args.dst}
tokenOut: ${logsWithdraw[i].args.tokenOut}
tokenAmountOut: ${logsWithdraw[i].args.tokenAmountOut.toString()}
poolAmountIn: ${logsWithdraw[i].args.poolAmountIn.toString()}
        `)
    }
  } catch (err) {
    console.error(err);
    return err;
  }

  console.log("Completed");
  return true;
};
