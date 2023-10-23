const { ethers, upgrades, run } = require("hardhat");
const XGHubABI = require("../artifacts/contracts/subscriptions/XGHub.sol/XGHub.json")

async function deploy() {

    // change before deployment
    const XGFeatureRegistryProxy = "0xa1BE7564Bb461EdDb5FCCD372951AB9BB82aF045"
    const XGWalletProxy = "0x1b3445aCf35B01EDd59fF5F5eE581d952455609f"
    const XGPurchasesProxy = "0x44b78522d6ea6B71Da29A553307F420a2ab78318"
    const XGSubscriptionsProxy = "0x6824Aa38bFD42d9c1e1E097e0EaCFF2d78fF1CbF"
    const FeeWalletAddress = "0xc4445886d2c0dfb3198447315C8C92399E6f9889"
    const XGHUB_PROXY_ADDRESS = "0x638988b3D33e0c7E68CF801787a8C37D063431c2"
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
