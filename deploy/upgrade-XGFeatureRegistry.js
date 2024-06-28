const { ethers, upgrades, run } = require("hardhat");

async function deploy() {

    const [deployer] = await ethers.getSigners()

    const startingBal = await deployer.getBalance()

    console.log("Deploying XGFeatureRegistry with the account:", deployer.address);
    console.log("Account balance:", (startingBal / 1e18).toString());

    let gasPrice = await ethers.provider.getGasPrice()
    gasPrice = parseInt(gasPrice * 1.2)

    // Address of the deployed proxy
    const proxyAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9"; // Replace with your existing proxy address

    const XGF = await ethers.getContractFactory('XGFeatureRegistry')
    const XGFeatureRegistryProxy = await upgrades.upgradeProxy(proxyAddress, XGF)
    await XGFeatureRegistryProxy.deployed()

    let frImp = await upgrades.erc1967.getImplementationAddress(XGFeatureRegistryProxy.address)

    console.log("Upgraded XGFeatureRegistry, new implementation deployed to: ", frImp)

    const contract = await XGF.attach(proxyAddress)
    const hub = await contract.hub()
    console.log("Hub address: ", hub)
    
}

deploy()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
