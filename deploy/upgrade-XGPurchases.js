const { ethers, upgrades, run } = require("hardhat");

async function deploy() {

    const [deployer] = await ethers.getSigners()

    const startingBal = await deployer.getBalance()

    console.log("Deploying XGPurchases with the account:", deployer.address);
    console.log("Account balance:", (startingBal / 1e18).toString());

    let gasPrice = await ethers.provider.getGasPrice()
    gasPrice = parseInt(gasPrice * 1.2)

    // Address of the deployed proxy
    const proxyAddress = "0x0165878A594ca255338adfa4d48449f69242Eb8F"; // Replace with your existing proxy address

    const XGP = await ethers.getContractFactory('XGPurchases')
    const XGPurchasesProxy = await upgrades.upgradeProxy(proxyAddress, XGP)
    await XGPurchasesProxy.deployed()

    let purImp = await upgrades.erc1967.getImplementationAddress(XGPurchasesProxy.address)
    
    console.log("Upgraded XGFeatureRegistry, new implementation deployed to: ", purImp)

    const contract = await XGP.attach(proxyAddress)
    const hub = await contract.hub()
    console.log("Hub address: ", hub)
    
}

deploy()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
