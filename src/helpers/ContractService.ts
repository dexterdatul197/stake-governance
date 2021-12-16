import { GOVERNENCE_RINKEBY_ABI, STRIKE_TOKEN_MAINNET_ABI, STRIKE_TOKEN_ROPSTEN_ABI } from './../constant/constants';
import Web3 from 'web3';

const instance = new Web3(window.ethereum);
const enviroment = process.env.REACT_APP_ENV;

export const governance = () => {
    if (enviroment === 'prod') {
        return new instance.eth.Contract(JSON.parse(GOVERNENCE_RINKEBY_ABI), process.env.REACT_APP_GOVERNANCE_ADDRESS);
    } else {
        return new instance.eth.Contract(JSON.parse(GOVERNENCE_RINKEBY_ABI), process.env.REACT_APP_GOVERNANCE_ADDRESS);
    }
}

export const getStrikeBalance = async(address: string) => {
    let strikeContract;
    if (enviroment === 'prod') {
        strikeContract = new instance.eth.Contract(JSON.parse(STRIKE_TOKEN_MAINNET_ABI), process.env.REACT_APP_MAIN_STRK_TOKEN_ADDRESS);
    } else {
        strikeContract = new instance.eth.Contract(JSON.parse(STRIKE_TOKEN_ROPSTEN_ABI), process.env.REACT_APP_TEST_STRK_TOKEN_ADDRESS);
    }
    return await strikeContract.methods.balanceOf(address);
}