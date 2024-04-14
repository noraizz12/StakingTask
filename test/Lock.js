const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("StakingContract", function () {
  let defiToken;
  let stakingContract;
  let owner;
  let user1;
  let user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy the DEFI token
    const DefiToken = await ethers.getContractFactory("DefiToken");
    defiToken = await DefiToken.deploy();
    await defiToken.deployed();

    // Deploy the StakingContract
    const StakingContract = await ethers.getContractFactory("StakingContract");
    stakingContract = await StakingContract.deploy(defiToken.address);
    await stakingContract.deployed();
  });

  it("should allow a user to stake tokens", async function () {
    // User stakes tokens
    await defiToken.connect(user1).approve(stakingContract.address, 1000);
    await stakingContract.connect(user1).stake(1000);

    // Check if the user's stake was successful
    const userStake = await stakingContract.stakes(user1.address);
    expect(userStake.amount).to.equal(1000);
  });

  it("should not allow a user to stake tokens multiple times", async function () {
    // User stakes tokens
    await defiToken.connect(user1).approve(stakingContract.address, 1000);
    await stakingContract.connect(user1).stake(1000);

    // Try to stake again
    await expect(stakingContract.connect(user1).stake(1000)).to.be.revertedWith(
      "Already staked"
    );
  });

  it("should allow a user to view their accumulated rewards", async function () {
    // User stakes tokens
    await defiToken.connect(user1).approve(stakingContract.address, 1000);
    await stakingContract.connect(user1).stake(1000);

    // User views accumulated rewards
    const reward = await stakingContract.connect(user1).viewReward();
    expect(reward).to.equal(0); // Initially, no rewards

    // Advance time
    await ethers.provider.send("evm_increaseTime", [24 * 60 * 60]); // Advance 1 day

    // User views accumulated rewards again
    const rewardAfter = await stakingContract
      .connect(user1)
      .viewReward();
    expect(rewardAfter).to.be.gt(0); // Rewards should have increased
  });

  it("should allow a user to claim their rewards", async function () {
    // User stakes tokens
    await defiToken.connect(user1).approve(stakingContract.address, 1000);
    await stakingContract.connect(user1).stake(1000);

    // Advance time
    await ethers.provider.send("evm_increaseTime", [24 * 60 * 60]); // Advance 1 day

    // User claims rewards
    await stakingContract.connect(user1).claimReward();

    // Check if rewards were paid
    const balance = await defiToken.balanceOf(user1.address);
    expect(balance).to.be.gt(0); // User should have received rewards
  });

  it("should allow a user to withdraw their stake and rewards", async function () {
    // User stakes tokens
    await defiToken.connect(user1).approve(stakingContract.address, 1000);
    await stakingContract.connect(user1).stake(1000);

    // Advance time
    await ethers.provider.send("evm_increaseTime", [24 * 60 * 60]); // Advance 1 day

    // User claims rewards
    await stakingContract.connect(user1).claimReward();

    // User withdraws their stake and rewards
    await stakingContract.connect(user1).withdraw();

    // Check if stake and rewards were withdrawn
    const balance = await defiToken.balanceOf(user1.address);
    expect(balance).to.be.gt(0); // User should have received stake and rewards
  });
});
