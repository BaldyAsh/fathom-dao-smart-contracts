// SPDX-License-Identifier: AGPL 3.0
// Copyright Fathom 2022

pragma solidity 0.8.13;

import "../StakingStructs.sol";
import "./IStakingGetter.sol";

interface IStakingHandler {
    function initializeStaking(
        address _admin,
        address _vault,
        address _mainToken,
        address _voteToken,
        Weight calldata _weight,
        uint256[] memory scheduleTimes,
        uint256[] memory scheduleRewards,
        uint256 tau,
        VoteCoefficient memory voteCoef,
        uint256 _maxLocks,
        address rewardsCalculator
    ) external;

    function proposeStream(
        address streamOwner,
        address rewardToken,
        uint256 maxDepositAmount,
        uint256 minDepositAmount,
        uint256[] memory scheduleTimes,
        uint256[] memory scheduleRewards,
        uint256 tau
    ) external; // only STREAM_MANAGER_ROLE
    function cancelStreamProposal(uint256 streamId) external;

    function createStream(uint256 streamId, uint256 rewardTokenAmount) external;
    function removeStream(uint256 streamId, address streamFundReceiver) external;

    function createLock(uint256 amount, uint256 lockPeriod, address account) external;
    function createLockWithoutEarlyWithdraw(
        uint256 amount, 
        uint256 lockPeriod, 
        address account,
        bool flag
    ) external;

    function unlockPartially(uint256 lockId, uint256 amount)  external;
    function unlock(uint256 lockId) external;
    function earlyUnlock(uint256 lockId) external;

    function claimRewards(uint256 streamId, uint256 lockId) external;
    function claimAllStreamRewardsForLock(uint256 lockId) external;
    function claimAllLockRewardsForStream(uint256 streamId) external;

    function withdrawAllRewards() external;

    function withdrawPenalty(address penaltyReceiver) external;
    function setWeight(Weight memory _weight)  external;

    function updateVault(address _vault) external;

    function setVoteToken(address _voteToken)  external;
    function setRewardsCalculator(address _rewardsCalculator) external;
    function setVoteCoefficient(VoteCoefficient memory voteCoef) external;
    function setMaxLockPeriod(uint256 _maxLockPeriod)  external;
    function setMaxLockPositions(uint256 _maxLockPositions) external;
}
