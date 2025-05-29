// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import {ERC721Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import {ERC721URIStorageUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "./LMS_Elemes.sol";

contract DelokCertificate is
    Initializable,
    ERC721Upgradeable,
    ERC721URIStorageUpgradeable,
    OwnableUpgradeable,
    UUPSUpgradeable
{
    uint256 private _nextTokenId;
    mapping(address => mapping(uint256 => bool)) private hasMinted_Elemes;
    mapping(address => mapping(uint256 => bool)) private hasRequested_Elemes;
    address private oracle;
    event TokenMinted_Elemes(
        uint256 tokenId,
        address indexed user,
        uint256 indexed courseId
    );
    event MintRequested_Elemes(address indexed user, uint256 indexed courseId);
    ILMS_Elemes public lmsElemes;

    modifier onlyOracle() {
        require(msg.sender == oracle, "Not authorized");
        _;
    }

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address initialOwner, address _oracle)
        public
        initializer
    {
        __ERC721_init("DelokCert", "DLC");
        __ERC721URIStorage_init();
        __Ownable_init(initialOwner);
        __UUPSUpgradeable_init();
        oracle = _oracle;
    }

    function updateOracle(address _oracle) external onlyOwner {
        require(_oracle != address(0), "Zero address");
        oracle = _oracle;
    }

    function setContractLMS_Elemes(address _lmsElemesAddress)
        external
        onlyOwner
    {
        require(_lmsElemesAddress != address(0), "Zero address");
        lmsElemes = ILMS_Elemes(_lmsElemesAddress);
    }

    function requestMintCertificate_Elemes(uint256 courseId) public {
        require(oracle != address(0), "Oracle undefined");
        require(address(lmsElemes) != address(0), "lmsElemes undefined");
        require(
            lmsElemes.IsRegistered(msg.sender),
            "You must be registered to request a certificate"
        );
        require(
            !hasRequested_Elemes[msg.sender][courseId],
            "You have already requested this course"
        );
        require(
            !hasMinted_Elemes[msg.sender][courseId],
            "You have already minted a certificate for this course"
        );
        hasRequested_Elemes[msg.sender][courseId] = true;
        emit MintRequested_Elemes(msg.sender, courseId);
    }

    function mintCertificate_Elemes(
        string memory _tokenURI,
        address _to,
        uint256 courseId
    ) public onlyOracle returns (uint256) {
        require(oracle != address(0), "Oracle undefined");
        require(address(lmsElemes) != address(0), "lmsElemes undefined");
        require(
            hasRequested_Elemes[_to][courseId],
            "User has not requested a certificate for this course"
        );
        require(
            !hasMinted_Elemes[_to][courseId],
            "User has already minted a certificate for this course"
        );
        uint256 tokenId = _nextTokenId++;
        _mint(_to, tokenId);
        _setTokenURI(tokenId, _tokenURI);
        hasMinted_Elemes[_to][courseId] = true;
        hasRequested_Elemes[_to][courseId] = false;
        emit TokenMinted_Elemes(tokenId, _to, courseId);
        return tokenId;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyOwner
    {}
}
