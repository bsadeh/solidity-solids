pragma solidity ^0.4.18;

import "./HasReaders.sol";
import "./HasWriters.sol";

/*
  generic storage of arrays for { bool[], int[], uint[], bytes[], string[], address[] } types.
  read/write permissions are distinct: only readers can read & only writes can write
*/
contract GenericArrayStorage is HasReaders, HasWriters {
  function GenericArrayStorage(address nominator) HasReaders(nominator) HasWriters(nominator) public { }

  mapping (bytes32 => bool[]) private boolArrayStore;
  mapping (bytes32 => int[]) private intArrayStore;
  mapping (bytes32 => uint[]) private uintArrayStore;
  mapping (bytes32 => bytes[]) private bytesArrayStore;
  mapping (bytes32 => string[]) private stringArrayStore;
  mapping (bytes32 => address[]) private addressArrayStore;


  function boolArrayGet(bytes32 key) onlyReader view public returns (bool[]) { return boolArrayStore[key]; }
  function intArrayGet(bytes32 key) onlyReader view public returns (int[]) { return intArrayStore[key]; }
  function uintArrayGet(bytes32 key) onlyReader view public returns (uint[]) { return uintArrayStore[key]; }
  function bytesArrayGet(bytes32 key) onlyReader view public returns (bytes[]) { return bytesArrayStore[key]; }
  function stringArrayGet(bytes32 key) onlyReader view public returns (string[]) { return stringArrayStore[key]; }
  function addressArrayGet(bytes32 key) onlyReader view public returns (address[]) { return addressArrayStore[key]; }

  function boolArraySet(bytes32 key, bool[] values) onlyWriter public { boolArrayStore[key] = values; }
  function intArraySet(bytes32 key, int[] values) onlyWriter public { intArrayStore[key] = values; }
  function uintArraySet(bytes32 key, uint[] values) onlyWriter public { uintArrayStore[key] = values; }
  function bytesArraySet(bytes32 key, bytes[] values) onlyWriter public { bytesArrayStore[key] = values; }
  function stringArraySet(bytes32 key, string[] values) onlyWriter public { stringArrayStore[key] = values; }
  function addressArraySet(bytes32 key, address[] values) onlyWriter public { addressArrayStore[key] = values; }

  function boolArrayDelete(bytes32 key) onlyWriter public { delete boolArrayStore[key]; }
  function intArrayDelete(bytes32 key) onlyWriter public { delete intArrayStore[key]; }
  function uintArrayDelete(bytes32 key) onlyWriter public { delete uintArrayStore[key]; }
  function bytesArrayDelete(bytes32 key) onlyWriter public { delete bytesArrayStore[key]; }
  function stringArrayDelete(bytes32 key) onlyWriter public { delete stringArrayStore[key]; }
  function addressArrayDelete(bytes32 key) onlyWriter public { delete addressArrayStore[key]; }
}
