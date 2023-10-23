const { ethers, upgrades, run } = require("hardhat");


async function deploy() {

    // change before deployment
    const xgtAddr = "0x9EB8A789Ed1Bd38D281962b523349d5D17A37d47"
    //

    const [deployer] = await ethers.getSigners()

    console.log("Deploying contracts with the account:", deployer.address)
    console.log("Account balance:", (await deployer.getBalance()).toString())
    console.log("Address for XGT-V3:", xgtAddr);

    let gasPrice = await ethers.provider.getFeeData()
    gasPrice["gasPrice"] = parseInt(gasPrice["gasPrice"] * 1.2)

    const XGHubFactory = await ethers.getContractFactory('TestVerify')
    const XGHubProxy = await upgrades.deployProxy(XGHubFactory, [deployer.address, xgtAddr])
    await XGHubProxy.deployed();

    console.log(XGHubProxy.address)

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

    console.log("Deployed Test to: ", XGHubProxy.address)
    
}

deploy()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
