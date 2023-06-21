// replace the name of the contract with which one you want to deploy!
const contractName = "Escrow";
const tokenContractName = "EscrowCoin";
const { utils } = require('ethers');
const {ethers} = require('hardhat')

async function main() {
  // deploys the escrow contract
  // const Escrow = await hre.ethers.getContractFactory(contractName);
  // const escrow = await Escrow.deploy();

  // console.log(`${contractName} deployed to address: ${escrow.address}`);

  // deploys the token contract for teesting 
  const initialSupply = utils.parseEther("10000000"); // 10_000_000 initial supply
  const Token = await hre.ethers.getContractFactory(tokenContractName);
  const token = await Token.deploy(initialSupply);

  console.log(`${tokenContractName} deployed to address: ${token.address}`);
}

main()
 .then(() => process.exit(0))
 .catch(error => {
   console.error(error);
   process.exit(1);
 });