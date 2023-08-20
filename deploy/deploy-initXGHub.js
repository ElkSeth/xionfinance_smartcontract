const { ethers, upgrades, run } = require("hardhat");
const XGHubABI = require("./artifacts/contracts/subscriptions/XGHub.sol/XGHub.json")

async function deploy() {

    // change before deployment
    const XGFeatureRegistryProxy = ""
    const XGWalletProxy = ""
    const XGPurchasesProxy = ""
    const XGSubscriptionsProxy = ""
    const FeeWalletAddress = ""
    const XGHUB_PROXY_ADDRESS = ""
    //

    const [deployer] = await ethers.getSigners()
    const startingBal = await deployer.getBalance()

    console.log("Initializing XGHUB with the account:", deployer.address);
    console.log("Account balance:", (startingBal / 1e18).toString());

    const XGHub = new ethers.Contract(XGHUB_PROXY_ADDRESS, XGHubABI.abi, ethers.provider)
    const XGHubProxy = XGHub.connect(deployer)

    console.log("Initializing XGHub...")

    await XGHubProxy.setFeaturesAddress(XGFeatureRegistryProxy)
    console.log("Set features address: ", XGFeatureRegistryProxy)

    await XGHubProxy.setWalletAddress(XGWalletProxy)
    console.log("Set wallet address: ", XGWalletProxy)

    await XGHubProxy.setPurchasesModule(XGPurchasesProxy)
    console.log("Set purchases address: ", XGPurchasesProxy)

    await XGHubProxy.setSubscriptionsModule(XGSubscriptionsProxy)
    console.log("Set subscriptions address: ", XGSubscriptionsProxy)

    await XGHubProxy.setFeeWallet(FeeWalletAddress)
    console.log("Set fee wallet address: ", FeeWalletAddress)

    console.log("Finished Initializing XGHub.")
}

deploy()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
