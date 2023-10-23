const { ethers, upgrades, run } = require("hardhat");

async function deploy() {

    // change before deployment
    const XGT_ADDRESS = "0x9EB8A789Ed1Bd38D281962b523349d5D17A37d47"
    const XGHUB_PROXY_ADDRESS = "0x638988b3D33e0c7E68CF801787a8C37D063431c2"
    const XGWalletTokens = ["0xc2132D05D31c914a87C6611C10748AEb04B58e8F"]
    //

    const [deployer] = await ethers.getSigners()

    const startingBal = await deployer.getBalance()

    console.log("Deploying XGWallet with the account:", deployer.address);
    console.log("Address for XGT-V3:", XGT_ADDRESS);
    console.log("Account balance:", (startingBal / 1e18).toString());

    const XGTF = await ethers.getContractFactory('XGTFreezer')
    const XGTFreezer = await XGTF.deploy(XGT_ADDRESS)
    await XGTFreezer.deployed();

    let retry = 0
    while (retry < 5) {
        try {

            await run(`verify:verify`, {
              address: XGTFreezer.address,
              constructorArguments: [XGT_ADDRESS],
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

    console.log("Deployed XGT Freezer to: ", XGTFreezer.address)

    let gasPrice = await ethers.provider.getGasPrice()
    gasPrice = parseInt(gasPrice * 1.2)

    const XGW = await ethers.getContractFactory('XGWallet')
    const XGWalletProxy = await upgrades.deployProxy(XGW, [XGHUB_PROXY_ADDRESS, XGTFreezer.address, XGWalletTokens, XGT_ADDRESS])
    await XGWalletProxy.deployed()

    let walImp = await upgrades.erc1967.getImplementationAddress(XGWalletProxy.address)
    console.log("Implementation at: ", walImp)

    // retry = 0
    // while (retry < 5) {
    //     try {

    //       let walImp = await upgrades.erc1967.getImplementationAddress(XGWalletProxy.address)
    //       console.log("Implementation at: ", walImp)

    //         await run(`verify:verify`, {
    //           address: walImp,
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
    
    console.log("Deployed XGWallet to: ", XGWalletProxy.address)
    
}

deploy()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
