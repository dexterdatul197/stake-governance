import { GOVERNENCE_RINKEBY_ABI } from './../constant/constants';
import Web3 from 'web3';

const instance = new Web3(window.ethereum);

export const governance = () => {
    return new instance.eth.Contract(JSON.parse(GOVERNENCE_RINKEBY_ABI), process.env.REACT_APP_GOVERNANCE_ADDRESS);
}