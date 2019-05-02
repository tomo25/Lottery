pragma solidity ^0.5.1;

contract lottery {
	
address public maneger; //親を一人決める
address[] public platers; //参加者を配列に納める

constructor(){
//親を決める
}

function enter(){
//同じ人が二度参加しようとしてないか確認
//残高条件を満たすか確認
//ゲームに参加する
}


function random(){
//乱数を生成する(とりあえずなんでもok)
}

modifier restricted(){
//コントラクト作成者にしか呼び出せない修飾子を作ろう
}

function pickWinner(){ //コントラクト生成者しか呼び出せないようにする
//当選者の番号を決める
//当選者が決まる
//参加者をリセットする
}

function getPlayers(){
//参加者を確認する
}

function getLotteryBalance(){
//デポジット金額を確認
}


}
