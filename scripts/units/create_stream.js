const fs = require('fs');
const constants = require('./helpers/constants') 
const txnHelper = require('./helpers/transactionSaver')

const eventsHelper = require("../tests/helpers/eventsHelper");

const IMultiSigWallet = artifacts.require("./dao/treasury/interfaces/IMultiSigWallet.sol");
const rawdata = fs.readFileSync(constants.PATH_TO_ADDRESSES);
const addresses = JSON.parse(rawdata);
const STREAM_REWARD_TOKEN_ADDRESS = ""
const REWARD_PROPOSAL_AMOUNT = web3.utils.toWei('','ether')
const STREAM_ID = 1//SET
const _encodeApproveFunction = (_account, _amount) => {
    let toRet =  web3.eth.abi.encodeFunctionCall({
        name: 'approve',
        type: 'function',
        inputs: [{
            type: 'address',
            name: 'spender'
        },{
            type: 'uint256',
            name: 'amount'
        }]
    }, [_account, _amount]);

    return toRet;
}

const _encodeCreateStreamFunction = (
    _streamId, _rewardTokenAmount
) => {
    let toRet =  web3.eth.abi.encodeFunctionCall({
        name: 'createStream',
        type: 'function',
        inputs: [{
            type: 'uint256',
            name: 'streamId'
        },{
            type: 'uint256',
            name: 'rewardTokenAmount'
        }]
    }, [_streamId, _rewardTokenAmount]);

    return toRet;
}

module.exports = async function(deployer) {
    const MULTISIG_WALLET_ADDRESS = addresses.multiSigWallet;
    const multiSigWallet = await IMultiSigWallet.at(MULTISIG_WALLET_ADDRESS);
    let approveStreamRewardsTxnIdx;
    let createStreamRewardsTxnIdx;

    const _approveStreamRewards = async(
        _account,
        _amount
    ) => {
        const result = await multiSigWallet.submitTransaction(
            STREAM_REWARD_TOKEN_ADDRESS,
            constants.EMPTY_BYTES,
            _encodeApproveFunction(
                _account,
                _amount
            ),
            0,
            {gas: 8000000}
        )

        const tx = eventsHelper.getIndexedEventArgs(result, constants.SUBMIT_TRANSACTION_EVENT)[0];
        await multiSigWallet.confirmTransaction(tx, {gas: 8000000});
        await multiSigWallet.executeTransaction(tx, {gas: 8000000});
        approveStreamRewardsTxnIdx = tx;
    }

    const _createStreamRewards = async(
        _streamId, _rewardTokenAmount
    ) => {
        const result = await multiSigWallet.submitTransaction(
            addresses.staking,
            constants.EMPTY_BYTES,
            _encodeCreateStreamFunction(
                _streamId,
                _rewardTokenAmount
            ),
            0,
            {gas: 8000000}
        )

        const tx = eventsHelper.getIndexedEventArgs(result, constants.SUBMIT_TRANSACTION_EVENT)[0];
        await multiSigWallet.confirmTransaction(tx, {gas: 8000000});
        await multiSigWallet.executeTransaction(tx, {gas: 8000000});
        createStreamRewardsTxnIdx = tx;
    }

    await _approveStreamRewards(
        addresses.staking,
        REWARD_PROPOSAL_AMOUNT
    )

    await _createStreamRewards(
        STREAM_ID,
        REWARD_PROPOSAL_AMOUNT
    )
    await txnHelper.saveTxnIndex("approveStreamRewardsTxn", approveStreamRewardsTxnIdx)   
    await txnHelper.saveTxnIndex("createStreamRewardsTxn", createStreamRewardsTxnIdx)   

}

