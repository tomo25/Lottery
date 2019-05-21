const { assertRevert } = require('./helpers/assertRevert');
const BigNumber = web3.BigNumber;
const lottery = artifacts.require('lottery.sol');


require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .should();

contract('lottery', function (accounts) {

  const creater = accounts[0] //親を定義

  beforeEach(async () => {
    this.lottery = await lottery.new({ from: creater });   //コントラクトのインスタンスを作成 
  });

  describe('lottery Contract', () => {
    it('deploys a contract', () => {
      assert.ok(lottery.address);  //コントラクトがデプロイできているか
    });

    it('allows one account to enter', async () => {  //enter関数で複数のアカウントが参加できるか
      await this.lottery.enter({  
        from: accounts[0],
        value: web3.utils.toWei('0.02', 'ether')
      });

      const players = await this.lottery.getPlayers()  //参加者を取得

      players[0].should.be.equal(accounts[0]);  //先頭の参加者はenterしたaccount[0]と一致
      players.length.should.be.equal(1); //参加者数は1
    });

    it('allows multiple accounts to enter', async () => { //enter関数で一つのアカウントが参加できるか
      await this.lottery.enter({
        from: accounts[0],
        value: web3.utils.toWei('0.02', 'ether')
      })
      await this.lottery.enter({
        from: accounts[1],
        value: web3.utils.toWei('0.02', 'ether')
      })
      await this.lottery.enter({
        from: accounts[2],
        value: web3.utils.toWei('0.02', 'ether')
      })

      const players = await this.lottery.getPlayers()  //参加者を取得

      accounts[0].should.be.equal(players[0]);  //先頭の参加者はenterしたaccount[0]と一致
      accounts[1].should.be.equal(players[1]);  //2番目の参加者はenterしたaccount[1]と一致
      accounts[2].should.be.equal(players[2]);  //3番目の参加者はenterしたaccount[2]と一致
      assert.equal(3, players.length);  //参加者数は3
    });

    it('requires a minimum amount of ether to enter', async () => {  //参加に必要な最低金額を設定
      await assertRevert(
        this.lottery.enter({
          from: accounts[0],
          value: 0
        })
      );
    });

    it('only manager can call pickWinner', async () => {  //勝者の抽選は親によってのみ発動
      await assertRevert(
        this.lottery.pickWinner({
          from: accounts[1]
        })
      );
    });

    it('sends money to the winner and resets the players array', async () => {  //勝者に賞金を送り、参加者の配列をリセットする
      await this.lottery.enter({  //親だけが2etherで参加した時
        from: accounts[0],
        value: web3.utils.toWei('2', 'ether')
      });

      const initialBalance = await web3.eth.getBalance(accounts[0]);  //親の残高
      await this.lottery.pickWinner({ from: accounts[0] }); //親によって抽選開始
      const finalBalance = await web3.eth.getBalance(accounts[0]); //親の抽選後の残高
      const difference = finalBalance - initialBalance; //残高の変化

      assert(difference > web3.utils.toWei('1.8', 'ether')); //残高の変化が1.8ether以上(ガス代考慮)
    });

  });
});
