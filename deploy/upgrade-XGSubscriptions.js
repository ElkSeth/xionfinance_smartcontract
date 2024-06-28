const { ethers, upgrades, run } = require("hardhat");

async function deploy() {

    const [deployer] = await ethers.getSigners()

    const startingBal = await deployer.getBalance()

    console.log("Deploying XGSubs with the account:", deployer.address);
    console.log("Account balance:", (startingBal / 1e18).toString());

    let gasPrice = await ethers.provider.getGasPrice()
    gasPrice = parseInt(gasPrice * 1.2)

    // Address of the deployed proxy
    const proxyAddress = "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318"; // Replace with your existing proxy address

    const XGS = await ethers.getContractFactory('XGSubscriptions')
    const XGSubscriptionsProxy = await upgrades.upgradeProxy(proxyAddress, XGS)
    await XGSubscriptionsProxy.deployed()

    let subImp = await upgrades.erc1967.getImplementationAddress(XGSubscriptionsProxy.address)
    console.log("Upgraded XGFeatureRegistry, new implementation deployed to: ", subImp)

    const contract = await XGS.attach(proxyAddress)
    const hub = await contract.hub()
    const dateTimeLib = await contract.dateTimeLib()
    console.log("Hub address: ", hub)
    console.log("DateTimeLib address: ", dateTimeLib)

    
}

deploy()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
