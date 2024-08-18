const { ethers, upgrades, run } = require("hardhat");

async function deploy() {

    // change before deployment
    const XGT_ADDRESS = "0x9EB8A789Ed1Bd38D281962b523349d5D17A37d47"
    const XGHUB_PROXY_ADDRESS = "0xf1B81f846B6EB58A530De6c6Cd850385A7d94302"
    const XGWalletTokens = ["0xc2132D05D31c914a87C6611C10748AEb04B58e8F"]

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
    const XGWalletProxy = await upgrades.deployProxy(XGW, [XGHUB_PROXY_ADDRESS, XGTFreezer.address, XGWalletTokens, XGT_ADDRESS], {"gasPrice": 120000000000})
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
