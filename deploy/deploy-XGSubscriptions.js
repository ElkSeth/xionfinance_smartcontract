const { ethers, upgrades, run } = require("hardhat");

async function deploy() {

    // change before deployment
    const XGT_ADDRESS = "0x9EB8A789Ed1Bd38D281962b523349d5D17A37d47"
    const XGHUB_PROXY_ADDRESS = "0x3EadE78241139a95c41Ecb0050e5E36357aF3b80"
    //

    const [deployer] = await ethers.getSigners()

    const startingBal = await deployer.getBalance()

    console.log("Deploying XGSubs with the account:", deployer.address);
    console.log("Address for XGT-V3:", XGT_ADDRESS);
    console.log("Account balance:", (startingBal / 1e18).toString());

    const DT = await ethers.getContractFactory('DateTime')
    const DateTime = await DT.deploy()
    await DateTime.deployed()

    console.log("Deployed DateTime to: ", DateTime.address)

    let gasPrice = await ethers.provider.getGasPrice()
    gasPrice = parseInt(gasPrice * 1.2)

    const XGS = await ethers.getContractFactory('XGSubscriptions')
    const XGSubscriptionsProxy = await upgrades.deployProxy(XGS, [XGHUB_PROXY_ADDRESS, DateTime.address])
    await XGSubscriptionsProxy.deployed()

    let subImp = await upgrades.erc1967.getImplementationAddress(XGSubscriptionsProxy.address)
    console.log("Implementation at: ", subImp)

    console.log("Deployed XGSubscriptions to: ", XGSubscriptionsProxy.address)
    
}

deploy()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
