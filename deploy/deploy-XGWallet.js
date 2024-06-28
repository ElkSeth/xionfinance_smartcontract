const { ethers, upgrades, run } = require("hardhat");

async function deploy() {

    // change before deployment
    const XGT_ADDRESS = "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270"
    const XGHUB_PROXY_ADDRESS = "0x9A29e9Bab1f0B599d1c6C39b60a79596b3875f56"
    const XGWalletTokens = ["0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270"]
    //

    const [deployer] = await ethers.getSigners()

    const startingBal = await deployer.getBalance()

    console.log("Deploying XGWallet with the account:", deployer.address);
    console.log("Address for XGT-V3:", XGT_ADDRESS);
    console.log("Account balance:", (startingBal / 1e18).toString());

    const XGTF = await ethers.getContractFactory('XGTFreezer')
    const XGTFreezer = await XGTF.deploy(XGT_ADDRESS)
    await XGTFreezer.deployed();

    console.log("Deployed XGT Freezer to: ", XGTFreezer.address)

    let gasPrice = await ethers.provider.getGasPrice()
    gasPrice = parseInt(gasPrice * 1.2)

    const XGW = await ethers.getContractFactory('XGWallet')
    const XGWalletProxy = await upgrades.deployProxy(XGW, [XGHUB_PROXY_ADDRESS, XGTFreezer.address, XGWalletTokens, XGT_ADDRESS])
    await XGWalletProxy.deployed()

    let walImp = await upgrades.erc1967.getImplementationAddress(XGWalletProxy.address)
    console.log("Implementation at: ", walImp)
    
    console.log("Deployed XGWallet to: ", XGWalletProxy.address)
    
}

deploy()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
