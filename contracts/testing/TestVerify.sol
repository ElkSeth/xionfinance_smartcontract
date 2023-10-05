// SPDX-License-Identifier: AGPL-3.0
pragma solidity 0.7.6;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";

contract TestVerify is OwnableUpgradeable, PausableUpgradeable {

    address public xgt;

    function initialize(address _owner, address _xgt) external initializer {
        xgt = _xgt;
        OwnableUpgradeable.__Ownable_init();
        PausableUpgradeable.__Pausable_init();
        OwnableUpgradeable.transferOwnership(_owner);
    }

}