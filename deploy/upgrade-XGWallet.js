const { ethers, upgrades, run } = require("hardhat");

async function deploy() {

    const [deployer] = await ethers.getSigners()

    const startingBal = await deployer.getBalance()

    console.log("Deploying XGWallet with the account:", deployer.address);
    console.log("Account balance:", (startingBal / 1e18).toString());

    let gasPrice = await ethers.provider.getGasPrice()
    gasPrice = parseInt(gasPrice * 1.2)

    // Address of deployed proxy
    const proxyAddress = "0xF483E82eCB700Ecb6E6397b05E02f4236A41e108"; // Replace with your existing proxy address

    const XGW = await ethers.getContractFactory('XGWallet')
    const XGWalletProxy = await upgrades.upgradeProxy(proxyAddress, XGW)
    await XGWalletProxy.deployed()

    let walImp = await upgrades.erc1967.getImplementationAddress(XGWalletProxy.address)
    console.log("Upgraded XGFeatureRegistry, new implementation deployed to: ", walImp)

    const contract = await XGW.attach(proxyAddress)
    const hub = await contract.hub()
    const xgt_address = await contract.XGT_ADDRESS()
    const freezer = await contract.freezer()
    console.log("Hub address: ", hub)
    console.log("XGT address: ", xgt_address)
    console.log("Freezer address: ", freezer)

    
}

deploy()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
