pragma solidity >=0.4.22 <0.9.0;

contract file{
    string filehash;

    function set(string memory _filehash) public {
      filehash = _filehash;
    }

    function get() public view returns (string memory) {
      return filehash;
    }
}
