import React, { Component } from 'react';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {
 state = {
   manager: '',
   players: [],
   balance: '',
   value: '',
   message: '',
   isLoading: false
 };

 async componentDidMount() {
  const manager = await lottery.methods.manager().call();
  console.log(manager)
  const players = await lottery.methods.getPlayers().call(); 
  const balance = await web3.eth.getBalance(lottery.options.address); //web3.jsのコード

  this.setState({ manager, players, balance });
}

//
// イベント処理
//

// データの更新
onRefresh = async () => {
  const manager = await lottery.methods.manager().call();
  const players = await lottery.methods.getPlayers().call();
  const balance = await web3.eth.getBalance(lottery.options.address);  //web3.jsのコード

  this.setState({ manager, players, balance });
}

// ETHをコントラクトへ送金する
onSubmit = async event => {
  event.preventDefault();
  const accounts = await web3.eth.getAccounts(); //web3.jsのコード
  this.setState({ message: 'トランザクションを待ってます...', isLoading: true });
  await lottery.methods.enter().send({
    from: accounts[0],
    value: web3.utils.toWei(this.state.value, 'ether')  //web3.jsのコード
  });
  this.setState({ message: '抽選に参加しました!', isLoading: false });
};

// 抽選コントラクトを実行する
onClick = async () => {
  const accounts = await web3.eth.getAccounts(); //web3.jsのコード
  this.setState({ message: 'トランザクションを待ってます...', isLoading: true });
  await lottery.methods.pickWinner().send({
    from: accounts[0]
  });
  this.setState({ message: '抽選が選ばれました!', isLoading: false });
};

render() {
  const { classes } = this.props;
  return (
    <div>
        <h2>抽選ゲーム</h2>
        <p>このコントラクトは {this.state.manager} さんによって運営されてます。</p>
        <p>現在 {this.state.players.length} 人が参加中です。</p>
        <p>現在 {web3.utils.fromWei(this.state.balance, 'ether')} ETHがプールされています</p>  /*web3.jsのコード*/
        <hr/>
        <form onSubmit={this.onSubmit}>
          <h4>抽選エントリー</h4>
          <div>
            <label>いくら送金しますか？</label>
            <input
            value={this.state.value}
            onChange={event => this.setState({ value: event.target.value })}
            />
          </div>
          <button>送金</button>
        </form>
        <hr />
        <h4>抽選結果</h4>
        <button onClick={this.onClick}>抽選する</button>
        <hr />
        <h1>{this.state.message}</h1>
    </div>
  );
}
}
export default App;
