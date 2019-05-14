pragma  solidity ^0.5.0;

contract lottery {
   address public manager;
   address payable[] public players;

   constructor () public {
       manager = msg.sender;
   }
   function enter() public payable{
       //同じ人がなんども参加できないようにしましょう
       for(uint i=0; i< players.length; i++) {
           require(msg.sender != players[i]);
       }
       //0.1ETH以上の参加費を指定しよう
       require(msg.value > 0.01 ether);
       players.push(msg.sender);
   }
   function random() private view returns (uint) {
       return uint(keccak256(abi.encodePacked(block.difficulty, now, players)));
   }
   function pickWinner() public restricted(){
       uint index = random() % players.length;
       players[index].transfer(address(this).balance);
       //抽選の後再度抽選ができるようにメンバーを削除しましょう
       players = new address payable[](0);
   }
   //コントラクト作成者にしか呼び出せない修飾子を作ろう
   modifier restricted() {
       require(msg.sender == manager);
       _;
   }
   function getPlayers() public view returns (address payable[] memory) {
       return players;
   }
   //抽選で溜まっている金額を返す関数を書こう
   function getLotteryBalance() public view returns(uint){
       return address(this).balance;
   }
}