import web3 from './web3';
import { abi } from './abi/lottery.json'

const address = '0xec04697deff2766e1c2c2f22684f28f02ba72e02'; //コントラクトアドレス
export default new web3.eth.Contract(abi,address);  //abiとコントラクトアドレスからインスタンスを作成