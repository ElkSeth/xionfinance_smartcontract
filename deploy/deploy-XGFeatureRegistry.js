const { ethers, upgrades, run } = require("hardhat");

async function deploy() {

    // change before deployment
    const XGT_ADDRESS = "0x7a9e5D43c70e9531c85b342A2Ae2dd4933D71221"
    const XGHUB_PROXY_ADDRESS = "0xeA72cA1240C822a6a0B71f22D00aBa96CBbF8034"
    //

    const [deployer] = await ethers.getSigners()

    const startingBal = await deployer.getBalance()

    console.log("Deploying XGFeatureRegistry with the account:", deployer.address);
    console.log("Address for XGT-V3:", XGT_ADDRESS);
    console.log("Account balance:", (startingBal / 1e18).toString());

    const XGF = await ethers.getContractFactory('XGFeatureRegistry')
    const XGFeatureRegistryProxy = await upgrades.deployProxy(XGF, [XGHUB_PROXY_ADDRESS])
    await XGFeatureRegistryProxy.deployed()

    let frImp = await upgrades.erc1967.getImplementationAddress(XGFeatureRegistryProxy.address)
    console.log("Implementation at: ", frImp)

    await new Promise(r => setTimeout(r, 5000));

    // await run(`verify:verify`, {
    //   address: frImp,
    //   constructorArguments: [],
    // });

    console.log("Deployed XGFeatureRegistry to: ", XGFeatureRegistryProxy.address)

    console.log("Subscriptions Contracts Deployed.")
    
}

deploy()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
