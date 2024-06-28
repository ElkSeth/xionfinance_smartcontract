const { ethers, upgrades, run } = require("hardhat");

async function deploy() {

  const [deployer] = await ethers.getSigners();

  const startingBal = await deployer.getBalance();

  console.log("Upgrading XGHUB with the account:", deployer.address);
  console.log("Account balance:", (startingBal / 1e18).toString());

  let gasPrice = await ethers.provider.getGasPrice();
  gasPrice = parseInt(gasPrice * 1.2);

  // Address of the deployed proxy
  const proxyAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"; // Replace with your existing proxy address

  const XGHubFactory = await ethers.getContractFactory('XGHub');
  const XGHubProxy = await upgrades.upgradeProxy(proxyAddress, XGHubFactory);
  await XGHubProxy.deployed();

  let hubImp = await upgrades.erc1967.getImplementationAddress(XGHubProxy.address);

  console.log("Upgraded XGHub, new implementation at:", hubImp);
    
}

deploy()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
