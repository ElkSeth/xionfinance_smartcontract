const { ethers, upgrades, run } = require("hardhat");
const XGHubABI = require("../artifacts/contracts/subscriptions/XGHub.sol/XGHub.json")

async function deploy() {

    // change before deployment
    const XGFeatureRegistryProxy = "0x62E7DC60B83018b89DE7438f09f63290e48910fA"
    const XGWalletProxy = "0xFFec034a192bA00428DE5FfF584D4E5A70C67e08"
    const XGPurchasesProxy = "0xf7ACd9fC82a8a77626E1B79d454832cbE842f501"
    const XGSubscriptionsProxy = "0x87a3B432d74480bD5438B7974e821fEC4caae29E"
    const FeeWalletAddress = "0xc4445886d2c0dfb3198447315C8C92399E6f9889"
    const XGHUB_PROXY_ADDRESS = "0x3EadE78241139a95c41Ecb0050e5E36357aF3b80"
    //

    const [deployer] = await ethers.getSigners()
    const startingBal = await deployer.getBalance()

    console.log("Initializing XGHUB with the account:", deployer.address);
    console.log("Account balance:", (startingBal / 1e18).toString());

    const XGHub = new ethers.Contract(XGHUB_PROXY_ADDRESS, XGHubABI.abi, ethers.provider)
    const XGHubProxy = XGHub.connect(deployer)

    console.log("Initializing XGHub...")

    let tx = await XGHubProxy.setFeaturesAddress(XGFeatureRegistryProxy)
     
    console.log("Set features address: ", XGFeatureRegistryProxy)

    tx = await XGHubProxy.setWalletAddress(XGWalletProxy)
    await tx.wait()
    console.log("Set wallet address: ", XGWalletProxy)

    tx = await XGHubProxy.setPurchasesModule(XGPurchasesProxy)
    await tx.wait()
    console.log("Set purchases address: ", XGPurchasesProxy)

    tx = await XGHubProxy.setSubscriptionsModule(XGSubscriptionsProxy)
    await tx.wait()
    console.log("Set subscriptions address: ", XGSubscriptionsProxy)

    tx = await XGHubProxy.setFeeWallet(FeeWalletAddress)
    await tx.wait()
    console.log("Set fee wallet address: ", FeeWalletAddress)

    console.log("Finished Initializing XGHub.")
}

deploy()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
