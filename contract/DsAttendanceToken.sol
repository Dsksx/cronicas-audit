// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "./node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./node_modules/@openzeppelin/contracts/access/Ownable.sol";

// import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";

contract DsAttendanceToken is ERC721, Ownable {

    using Strings for uint256;

    uint startEventDate = 1676550900;
    uint endEvenDate = 1708087823;
        
    constructor() ERC721 ( unicode"Crónicas de un marinero desahuciado - Token de asistencia", "CMDTA") {}
    
    function mint(address account, uint256 tokenId) external {
        _checkOwner();
        _checkEventActive();
        _checkOneByAccount(account);
        _safeMint(account, tokenId);
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        _requireMinted(tokenId);

        return "ipfs://QmPiSsQzGsxLsiT3fJ9ECkndatg7b71rHKj2QHgX54J3Hm";
    }

    function _checkEventActive() internal view {
        require(block.timestamp > startEventDate && block.timestamp < endEvenDate, "Event is not active");
    }

    function _checkOneByAccount(address account) internal view {
        require(balanceOf(account) == 0, "One per account");
    }
    
}