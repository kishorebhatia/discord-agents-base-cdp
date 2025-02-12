// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AgentToken is ERC20, Ownable {
    uint256 public constant REWARD_AMOUNT = 10 * 10**18; // 10 tokens
    uint256 public constant MAX_SUPPLY = 1000000 * 10**18; // 1 million tokens

    constructor(
        string memory name,
        string memory symbol
    ) ERC20(name, symbol) {
        _mint(msg.sender, MAX_SUPPLY);
    }

    function airdrop(address user) external onlyOwner {
        require(balanceOf(address(this)) >= REWARD_AMOUNT, "Insufficient balance for reward");
        _transfer(address(this), user, REWARD_AMOUNT);
    }
}
