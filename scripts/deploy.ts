import { ethers } from "hardhat";

async function main() {

  const Petitions = await ethers.getContractFactory("Petitions");
  const petitions = await Petitions.deploy();

  await petitions.deployed();

  console.log(`Petitions deployed to ${petitions.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
