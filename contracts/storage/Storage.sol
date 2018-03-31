pragma solidity ^0.4.19;

import "./GenericStorage.sol";
import "./GenericArrayStorage.sol";

/*
  a storage combining:
  - storage of single value of { bool, int, uint, bytes, string, address } types
  - storage of multiple values (arrays) of { bool[], int[], uint[], bytes[], string[], address[] } types
  read/write permissions are distinct: only readers can read, and only writes can write.

  intended to be deployed as a stand-alone contract, but can be mixed-in.
*/
contract Storage is GenericStorage, GenericArrayStorage {
  string public constant version = "1.0.0";

  function Storage(address nominator) GenericStorage(nominator) GenericArrayStorage(nominator) public { }
}
