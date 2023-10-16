const { ethers, upgrades, run } = require("hardhat");

async function deploy() {

    // change before deployment
    const xgtAddr = "0x7a9e5D43c70e9531c85b342A2Ae2dd4933D71221"
    //

    const [deployer] = await ethers.getSigners()

    const startingBal = await deployer.getBalance()

    console.log("Deploying XGHUB with the account:", deployer.address);
    console.log("Address for XGT-V3:", xgtAddr);
    console.log("Account balance:", (startingBal / 1e18).toString());

    let gasPrice = await ethers.provider.getGasPrice()
    gasPrice = parseInt(gasPrice * 1.2)
    
    const XGHubFactory = await ethers.getContractFactory('XGHub')
    const XGHubProxy = await upgrades.deployProxy(XGHubFactory, [deployer.address, xgtAddr], {gasPrice: gasPrice})
    await XGHubProxy.deployed();

    let retry = 0
    while (retry < 5) {
        try {

            let hubImp = await upgrades.erc1967.getImplementationAddress(XGHubProxy.address)
            console.log("Implementation at: ", hubImp)

            await run(`verify:verify`, {
              address: hubImp,
              constructorArguments: [],
            });

            break

         } catch (e) {
            console.log(e.message)
            console.log("Retrying...")
            retry++

            await new Promise(r => setTimeout(r, 5000));

            if (retry == 5) {
              console.log("Unable to verify contracts.")
            }

         }
    }

    console.log("Deployed XGHub to: ", XGHubProxy.address)
    
}

deploy()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
