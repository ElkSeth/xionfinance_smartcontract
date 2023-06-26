// SPDX-License-Identifier: AGPL-3.0
pragma solidity 0.7.6;
pragma abicoder v2;

import "../subscriptions/OperationData.sol";

interface IXGWallet {
    enum Currency {
        NULL,
        XDAI,
        XGT
    }

    function payWithToken(
        address _token,
        address _from,
        address _to,
        uint256 _amount,
        bool _withFreeze,
        OperationData memory _operationData
    ) external returns (bool);

    function getUserTokenBalance(address _token, address _user) external view returns (uint256);

    function pause() external;

    function unpause() external;

    function setFeeWallet(address _feeWallet) external;

    function setSubscriptionsContract(address _subscriptions) external;

    function setPurchasesContract(address _purchases) external;

    function transferOwnership(address newOwner) external;
}
