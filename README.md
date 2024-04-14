https://sepolia.etherscan.io/address/0xad791170Bdeb8001aEeEA5E49a3982636EF5F88a#code

Accepts DEFI as the staking token and gives out DEFI as the reward: Yes, the contract takes DEFI tokens for staking and rewards users with DEFI tokens.

Rewards 1 DEFI token per day for every 1000 DEFI tokens staked: This condition is met as the rewardPerStakePerDay is set to 1 ether, which is equivalent to 1 DEFI token, and the calculation is based on 1000 DEFI tokens staked.

Rewards emitted to the user every block: Yes, rewards are calculated and emitted to the user every time they interact with the contract (staking, withdrawing, or claiming rewards).

User able to stake multiple times: Yes, the contract allows users to stake multiple times.

User able to withdraw at any time: Yes, users can withdraw their staked amount and accumulated rewards at any time.

User able to view their rewards at any given time: Yes, there's a function viewReward that allows users to view their accumulated rewards.

Upon withdrawal, the entire stake amount and rewards should be sent to the user: Yes, when a user withdraws, they receive both their staked amount and accumulated rewards.

No partial withdrawal of the stake amount: Yes, the entire staked amount is withdrawn at once.



User A stakes 1000 DEFI on 1st January and withdraws on 11th January: The calculation is accurate as it considers the time elapsed and rewards earned during that period.

User A stakes 100 DEFI tokens on 1st February, stakes 900 DEFI tokens more on 11th February, then withdraws funds on 21st February: The calculation also seems accurate, considering the different staking periods and reward accumulation for each period.