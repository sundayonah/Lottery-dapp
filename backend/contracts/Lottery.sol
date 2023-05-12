// SPDX-License-Identifier: MIT

pragma solidity ^0.8.15;

contract Lottery {
    //state Storage Variables

    address public owner;
    address payable[] public players;
    address[] public winners;
    uint public lotteryId;

    constructor() {
        owner = msg.sender;
        lotteryId = 0;
    }

    //Enter Function
    function enter() public payable {
        require(msg.value >= 0.1 ether);
        players.push(payable(msg.sender));
    }

    //Get Players
    function getPlayers() public view returns (address payable[] memory) {
        return players;
    }

    //Get Balnce
    function getBalance() public view returns (uint) {
        //Solidity Works In WEI
        return address(this).balance;
    }

    //Get Lottery Id
    function getLotteryId() public view returns (uint) {
        return lotteryId;
    }

    //Get Random Number (helper function for picking winner)
    function getRandomNumber() public view returns (uint) {
        return uint(keccak256(abi.encodePacked(owner, block.timestamp)));
    }

    //Pick Winner
    function pickWinner() public {
        //only the owner can pick Winner
        require(msg.sender == owner, "Only the owner can pick the winner.");

        uint randomIndex = getRandomNumber() % players.length;
        players[randomIndex].transfer(address(this).balance);
        winners.push(players[randomIndex]);
        lotteryId++;

        //Clear the players array. ['player1', 'player2']==[]
        players = new address payable[](0);
    }

    function getWinners() public view returns (address[] memory) {
        return winners;
    }
}
