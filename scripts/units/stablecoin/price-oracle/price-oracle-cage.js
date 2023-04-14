const fs = require('fs');
const txnHelper = require('../../helpers/submitAndExecuteTransaction')

const addressesConfig = require('../../../../config/config')

const PRICE_ORACLE_ADDRESS =addressesConfig.PRICE_ORACLE_ADDRESS

const _encodeCage = () => {
    let toRet =  web3.eth.abi.encodeFunctionCall({
        name: 'cage',
        type: 'function',
        inputs: []
    }, []);
    return toRet;
}


module.exports = async function(deployer) {

    await txnHelper.submitAndExecute(
        _encodeCage(),
        PRICE_ORACLE_ADDRESS,
        "cagePriceOracle"
    )
}