const { ethers, upgrades, run } = require("hardhat");

async function deploy() {

    // change before deployment
    const XGT_ADDRESS = "0x7a9e5D43c70e9531c85b342A2Ae2dd4933D71221"
    const XGHUB_PROXY_ADDRESS = "0xeA72cA1240C822a6a0B71f22D00aBa96CBbF8034"
    //

    const [deployer] = await ethers.getSigners()

    const startingBal = await deployer.getBalance()

    console.log("Deploying XGPurchases with the account:", deployer.address);
    console.log("Address for XGT-V3:", XGT_ADDRESS);
    console.log("Account balance:", (startingBal / 1e18).toString());

    const XGP = await ethers.getContractFactory('XGPurchases')
    const XGPurchasesProxy = await upgrades.deployProxy(XGP, [XGHUB_PROXY_ADDRESS])
    await XGPurchasesProxy.deployed()

    let purImp = await upgrades.erc1967.getImplementationAddress(XGPurchasesProxy.address)
    console.log("Implementation at: ", purImp)

    await new Promise(r => setTimeout(r, 5000));

    // await run(`verify:verify`, {
    //   address: purImp,
    //   constructorArguments: [],
    // });

    console.log("Deployed XGPurchases to: ", XGPurchasesProxy.address)
    
}

deploy()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
