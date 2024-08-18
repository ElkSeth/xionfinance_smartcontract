const { ethers, upgrades, run } = require("hardhat");
const XGHubABI = require("../artifacts/contracts/subscriptions/XGHub.sol/XGHub.json")

async function deploy() {

    // change before deployment
    const XGFeatureRegistryProxy = "0x7E91b63E0e90F7c7195D6Ee7B8D5B956f390E293"
    const XGWalletProxy = "0xF483E82eCB700Ecb6E6397b05E02f4236A41e108"
    const XGPurchasesProxy = "0x58554B7d64ca9A4e59CD64BE8C18094A0D0ffEf0"
    const XGSubscriptionsProxy = "0x8F4FB237E06EAc740Ce32F8dd9B624B4Aa8A7DE4"
    const FeeWalletAddress = "0xc4445886d2c0dfb3198447315C8C92399E6f9889"
    const XGHUB_PROXY_ADDRESS = "0xf1B81f846B6EB58A530De6c6Cd850385A7d94302"
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
