import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { VotingContract } from "../typechain-types";

const deployVotingContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  // Достаём адрес аккаунта, на котором будет 
  // происходить развёртывание смарт-контракта
  const { deployer } = await hre.getNamedAccounts();
  // Достаём функцию для развёртывания смарт-контракта
  const { deploy } = hre.deployments;
  // Деплоим смарт-контракт с именем VotingContract
  await deploy("VotingContract", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  const votingContract = await hre.ethers.getContract<VotingContract>("VotingContract", deployer);
};

export default deployVotingContract;
// Чтобы можно было легко управлять развёртыванием
deployVotingContract.tags = ["VotingContract"];
