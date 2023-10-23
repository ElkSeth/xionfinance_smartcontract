const { ethers, upgrades, run } = require("hardhat");

async function deploy() {

    // change before deployment
    const XGT_ADDRESS = "0x9EB8A789Ed1Bd38D281962b523349d5D17A37d47"
    const XGHUB_PROXY_ADDRESS = "0x638988b3D33e0c7E68CF801787a8C37D063431c2"
    //

    const [deployer] = await ethers.getSigners()

    const startingBal = await deployer.getBalance()

    console.log("Deploying XGPurchases with the account:", deployer.address);
    console.log("Address for XGT-V3:", XGT_ADDRESS);
    console.log("Account balance:", (startingBal / 1e18).toString());

    let gasPrice = await ethers.provider.getGasPrice()
    gasPrice = parseInt(gasPrice * 1.2)

    const XGP = await ethers.getContractFactory('XGPurchases')
    const XGPurchasesProxy = await upgrades.deployProxy(XGP, [XGHUB_PROXY_ADDRESS])
    await XGPurchasesProxy.deployed()

    let purImp = await upgrades.erc1967.getImplementationAddress(XGPurchasesProxy.address)
    console.log("Implementation at: ", purImp)

    // let retry = 0
    // while (retry < 5) {
    //     try {

    //         let purImp = await upgrades.erc1967.getImplementationAddress(XGPurchasesProxy.address)
    //         console.log("Implementation at: ", purImp)

    //         await run(`verify:verify`, {
    //           address: purImp,
    //           constructorArguments: [],
    //         });

    //         break

    //      } catch (e) {
    //         console.log(e.message)
    //         console.log("Retrying...")
    //         retry++

    //         await new Promise(r => setTimeout(r, 5000));

    //         if (retry == 5) {
    //           console.log("Unable to verify contracts.")
    //         }

    //      }
    // }

    
    console.log("Deployed XGPurchases to: ", XGPurchasesProxy.address)
    
}

deploy()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
