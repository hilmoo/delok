// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

contract LMS_Elemes {
    enum Status { None, Requested, Registered }
    mapping(address => Status) private _userStatus;
    mapping(address => bytes32) private _registeredUsers;
    address public oracle;

    event RegistrationRequested(address indexed user);
    event UserRegistered(address indexed user, bytes32 lmsid);

    modifier onlyOracle() {
        require(msg.sender == oracle, "Not authorized");
        _;
    }

    constructor(address _oracle) {
        oracle = _oracle;
    }

    function register() public {
        require(_userStatus[msg.sender] == Status.None, "Already requested or registered");
        _userStatus[msg.sender] = Status.Requested;
        emit RegistrationRequested(msg.sender);
    }

    function assignLMSid(address user, bytes32 lmsid) public onlyOracle {
        require(_userStatus[user] == Status.Requested, "Registration not requested or already registered");
        _registeredUsers[user] = lmsid;
        _userStatus[user] = Status.Registered;
        emit UserRegistered(user, lmsid);
    }

    function IsRegistered(address _user) public view returns (bool) {
        return _userStatus[_user] == Status.Registered;
    }

    function getLMSid(address _user) public view onlyOracle returns (bytes32) {
        require(_userStatus[_user] == Status.Registered, "User not registered");
        return _registeredUsers[_user];
    }
}

interface ILMS_Elemes {
    function IsRegistered(address _user) external view returns (bool);
}