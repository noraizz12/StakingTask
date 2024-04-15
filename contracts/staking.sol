// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";


contract StakingContract is Ownable,ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public defiToken;
    uint256 public constant rewardPerStakePerDay = 1 ether; // 1 DEFI token per day per 1000 DEFI tokens staked
    uint256 public constant blocksPerDay = 86400 / 6; // Assuming Ethereum block time is approximately 6 seconds

    struct Stake {
        uint256 amount;
        uint256 startTime;
        uint256 lastClaimTime;
        uint256 accumulatedReward;
    }

    mapping(address => Stake) public stakes;
    mapping(address => uint256) public totalStakedAmountPerUser; // Total staked amount per user
    uint256 public totalStakedAmount;
    uint256 public totalRewardsPaid;

    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardClaimed(address indexed user, uint256 amount);

    constructor(address _defiToken,address initialOwner) Ownable(initialOwner) {
        defiToken = IERC20(_defiToken);
    }

    function stake(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");

        defiToken.safeTransferFrom(msg.sender, address(this), amount);

        // Update the total stake amount for the user
        totalStakedAmountPerUser[msg.sender] += amount;

        // Add to the existing stake amount for the user
        stakes[msg.sender].amount += amount;
        if (stakes[msg.sender].startTime == 0) {
            stakes[msg.sender].startTime = block.timestamp;
        }
        stakes[msg.sender].lastClaimTime = block.timestamp;
        totalStakedAmount += amount;

        emit Staked(msg.sender, amount);
    }

    function withdraw() external {
        require(stakes[msg.sender].amount > 0, "No staked amount");

        uint256 totalPayout = calculateReward(msg.sender);

        // Add the total staked amount for the user
        totalPayout += totalStakedAmountPerUser[msg.sender];

        // Reset the total stake amount for the user
        totalStakedAmountPerUser[msg.sender] = 0;

        // Reset the stake details for the user
        delete stakes[msg.sender];

        defiToken.safeTransfer(msg.sender, totalPayout);

        emit Withdrawn(msg.sender, totalPayout);
    }

    function calculateReward(address user) internal returns (uint256) {
        Stake storage userStake = stakes[user];
        uint256 elapsedTime = block.timestamp - userStake.lastClaimTime;
        uint256 rewardPerDay = userStake.amount / 1000 * rewardPerStakePerDay;
        uint256 rewards = (elapsedTime / (blocksPerDay * 1 seconds)) * rewardPerDay;
        userStake.lastClaimTime = block.timestamp; // Update last claim time
        userStake.accumulatedReward += rewards; // Update accumulated rewards
        return rewards;
    }

    function claimReward() external {
        require(stakes[msg.sender].amount > 0, "No staked amount");

        uint256 reward = calculateReward(msg.sender);
        totalRewardsPaid += reward;

        defiToken.safeTransfer(msg.sender, reward);

        emit RewardClaimed(msg.sender, reward);
    }

    function viewReward(address user) external view returns (uint256) {
        return stakes[user].accumulatedReward;
    }
}
