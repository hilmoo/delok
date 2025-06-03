// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

contract LMS_Elemes {
    uint8 constant STATUS_NONE = 0;
    uint8 constant STATUS_REQUESTED = 1;
    uint8 constant STATUS_REGISTERED = 2;

    mapping(address => uint8) private _userStatus;
    mapping(address => bytes32) private _registeredUsers;
    mapping(bytes32 => bool) private _lmsidAssigned;
    address public oracle;

    event RegistrationRequested(address user, bytes32 indexed lmsid);
    event UserRegistered(address indexed user, bytes32 indexed lmsid);

    modifier onlyOracle() {
        require(msg.sender == oracle, "Not authorized");
        _;
    }

    constructor(address _oracle) {
        oracle = _oracle;
    }

    function register(bytes32 _lmsid) external {
        require(
            _userStatus[msg.sender] == STATUS_NONE,
            "Already requested or registered"
        );
        _userStatus[msg.sender] = STATUS_REQUESTED;
        emit RegistrationRequested(msg.sender, _lmsid);
    }

    function assignLMSid(address _user, bytes32 _lmsid) external onlyOracle {
        require(
            _userStatus[_user] == STATUS_REQUESTED,
            "User has not requested registration or is already registered"
        );
        require(!_lmsidAssigned[_lmsid], "lmsid already assigned");
        _registeredUsers[_user] = _lmsid;
        _lmsidAssigned[_lmsid] = true;
        _userStatus[_user] = STATUS_REGISTERED;
        emit UserRegistered(_user, _lmsid);
    }

    function IsRegistered(address _user) external view returns (bool) {
        return _userStatus[_user] == STATUS_REGISTERED;
    }

    function getLMSid(address _user) external view returns (bytes32) {
        require(_userStatus[_user] == STATUS_REGISTERED, "User not registered");
        return _registeredUsers[_user];
    }
}

interface ILMS_Elemes {
    function IsRegistered(address _user) external view returns (bool);

    function getLMSid(address _user) external view returns (bytes32);
}
