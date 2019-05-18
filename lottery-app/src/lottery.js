import web3 from './web3';
import { abi } from './abi/lottery.json'

const address = '0xD6519A93cE204420242b103d741B8Fd556549B6C';
export default new web3.eth.Contract(abi.address);