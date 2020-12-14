const ethers = require("ethers");
const fs = require("fs");
const { abis, addresses } = require("../contracts");
const { ethToVlx } = require("./vlxAddress");
const moment = require("moment");

const usdtPoolId = 3;
const fromBlock = 0;
const toBlock = 4293935;

exports.handler = async function () {
  console.log("Starting...");
  const ConnectorFactoryAbi = abis.ConnectorFactory;
  const ConnectorFactoryAddress = addresses.connectorFactory;
  const ConnectorAbi = abis.BptConnector;

  // Initialize Ethers wallet
  const provider = new ethers.providers.JsonRpcProvider({url:process.env.URL,timeout:300000});
  // Load contract
  const factoryContract = new ethers.Contract(ConnectorFactoryAddress, ConnectorFactoryAbi, provider);

  try {
    const blockNumber = await provider.getBlockNumber();
    console.log(`current block: ${blockNumber}`);
    const fileName = `./address.json`;

    const factoryFilter = factoryContract.filters.LogCreateConnector();
    factoryFilter.fromBlock = fromBlock;
    factoryFilter.toBlock = toBlock;

    const createConnectorLogs = await provider.getLogs(factoryFilter);
    let userSet = new Set();

    for(let index = 0;index < createConnectorLogs.length;index++){
      const logData = factoryContract.interface.parseLog(createConnectorLogs[index]);
      const contract = new ethers.Contract(logData.args.connector, ConnectorAbi, provider);
      
      const refFilter = contract.filters.LogDepositWithReferral();
        refFilter.fromBlock = fromBlock;
        refFilter.toBlock = toBlock;
        const refLogs = await provider.getLogs(refFilter);
        for(let i=0;i<refLogs.length;i++){
          const parseData = contract.interface.parseLog(refLogs[i]);
          userSet.add(ethToVlx(parseData.args.dst)+"\n");
        }
        
        const depositFilter = contract.filters.LogDeposit();
        depositFilter.fromBlock = fromBlock;
        depositFilter.toBlock = toBlock;
        const depositLogs = await provider.getLogs(depositFilter);
        for(let i = 0; i < depositLogs.length;i++){
          const parseData = contract.interface.parseLog(depositLogs[i]);
          userSet.add(ethToVlx(parseData.args.dst)+"\n");
        }
    }
   
   console.log(Array.from(userSet))

    fs.writeFile(fileName, Array.from(userSet), function (err) {
        if (err) console.log(err);
      });  
  } catch (err) {
    console.error(err);
    return err;
  }

  console.log("Completed");
  return true;
};
