pragma solidity ^0.4.19;

import "./HasReaders.sol";
import "./HasWriters.sol";

/*
  generic storage for { bool, int, uint, bytes, string, address } types.
  read/write permissions are distinct: only readers can read, and only writes can write.

  intended to be deployed as a stand-alone contract, but can be mixed-in.
*/
contract GenericStorage is HasReaders, HasWriters {
  string public constant version = "1.0.0";

  function GenericStorage(address nominator) HasReaders(nominator) HasWriters(nominator) public { }

  mapping (bytes32 => bool) private boolStore;
  mapping (bytes32 => int) private intStore;
  mapping (bytes32 => uint) private uintStore;
  mapping (bytes32 => bytes) private bytesStore;
  mapping (bytes32 => string) private stringStore;
  mapping (bytes32 => address) private addressStore;


  function boolGet(bytes32 key) onlyReader view public returns (bool) { return boolStore[key]; }
  function intGet(bytes32 key) onlyReader view public returns (int) { return intStore[key]; }
  function uintGet(bytes32 key) onlyReader view public returns (uint) { return uintStore[key]; }
  function bytesGet(bytes32 key) onlyReader view public returns (bytes) { return bytesStore[key]; }
  function stringGet(bytes32 key) onlyReader view public returns (string) { return stringStore[key]; }
  function addressGet(bytes32 key) onlyReader view public returns (address) { return addressStore[key]; }

  function boolSet(bytes32 key, bool value) onlyWriter public { boolStore[key] = value; }
  function intSet(bytes32 key, int value) onlyWriter public { intStore[key] = value; }
  function uintSet(bytes32 key, uint value) onlyWriter public { uintStore[key] = value; }
  function bytesSet(bytes32 key, bytes value) onlyWriter public { bytesStore[key] = value; }
  function stringSet(bytes32 key, string value) onlyWriter public { stringStore[key] = value; }
  function addressSet(bytes32 key, address value) onlyWriter public { addressStore[key] = value; }

  function boolDelete(bytes32 key) onlyWriter public { delete boolStore[key]; }
  function intDelete(bytes32 key) onlyWriter public { delete intStore[key]; }
  function uintDelete(bytes32 key) onlyWriter public { delete uintStore[key]; }
  function bytesDelete(bytes32 key) onlyWriter public { delete bytesStore[key]; }
  function stringDelete(bytes32 key) onlyWriter public { delete stringStore[key]; }
  function addressDelete(bytes32 key) onlyWriter public { delete addressStore[key]; }
}
