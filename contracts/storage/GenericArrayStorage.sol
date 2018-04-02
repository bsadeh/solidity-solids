pragma solidity ^0.4.21;

import "./HasReaders.sol";
import "./HasWriters.sol";

/*
  generic storage of arrays for { bool[], int[], uint[], bytes[], string[], address[] } types.
  read/write permissions are distinct: only readers can read & only writes can write.

  note: due to current Solidity `Nested dynamic arrays not implemented` limitations,
  some methods are not implemented for string[] & bytes[] types.
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
  //function bytesArrayGet(bytes32 key) onlyReader view public returns (bytes[]) { return bytesArrayStore[key]; }     // Nested dynamic arrays not implemented
  //function stringArrayGet(bytes32 key) onlyReader view public returns (string[]) { return stringArrayStore[key]; }  // Nested dynamic arrays not implemented
  function addressArrayGet(bytes32 key) onlyReader view public returns (address[]) { return addressArrayStore[key]; }

  function boolArraySet(bytes32 key, bool[] values) onlyWriter public { boolArrayStore[key] = values; }
  function intArraySet(bytes32 key, int[] values) onlyWriter public { intArrayStore[key] = values; }
  function uintArraySet(bytes32 key, uint[] values) onlyWriter public { uintArrayStore[key] = values; }
  //function bytesArraySet(bytes32 key, bytes[] values) onlyWriter public { bytesArrayStore[key] = values; }    // Nested dynamic arrays not implemented
  //function stringArraySet(bytes32 key, string[] values) onlyWriter public { stringArrayStore[key] = values; } // Nested dynamic arrays not implemented
  function addressArraySet(bytes32 key, address[] values) onlyWriter public { addressArrayStore[key] = values; }

  function boolArraySize(bytes32 key) onlyReader view public returns (uint) { return boolArrayStore[key].length; }
  function intArraySize(bytes32 key) onlyReader view public returns (uint) { return intArrayStore[key].length; }
  function uintArraySize(bytes32 key) onlyReader view public returns (uint) { return uintArrayStore[key].length; }
  function bytesArraySize(bytes32 key) onlyReader view public returns (uint) { return bytesArrayStore[key].length; }
  function stringArraySize(bytes32 key) onlyReader view public returns (uint) { return stringArrayStore[key].length; }
  function addressArraySize(bytes32 key) onlyReader view public returns (uint) { return addressArrayStore[key].length; }

  function boolArrayDelete(bytes32 key) onlyWriter public { delete boolArrayStore[key]; }
  function intArrayDelete(bytes32 key) onlyWriter public { delete intArrayStore[key]; }
  function uintArrayDelete(bytes32 key) onlyWriter public { delete uintArrayStore[key]; }
  function bytesArrayDelete(bytes32 key) onlyWriter public { delete bytesArrayStore[key]; }
  function stringArrayDelete(bytes32 key) onlyWriter public { delete stringArrayStore[key]; }
  function addressArrayDelete(bytes32 key) onlyWriter public { delete addressArrayStore[key]; }


  function boolAt(bytes32 key, uint i) onlyReader view public returns (bool) { return boolArrayStore[key][i]; }
  function intAt(bytes32 key, uint i) onlyReader view public returns (int) { return intArrayStore[key][i]; }
  function uintAt(bytes32 key, uint i) onlyReader view public returns (uint) { return uintArrayStore[key][i]; }
  function bytesAt(bytes32 key, uint i) onlyReader view public returns (bytes) { return bytesArrayStore[key][i]; }
  function stringAt(bytes32 key, uint i) onlyReader view public returns (string) { return stringArrayStore[key][i]; }
  function addressAt(bytes32 key, uint i) onlyReader view public returns (address) { return addressArrayStore[key][i]; }

  function boolUpdate(bytes32 key, uint i, bool value) onlyWriter public { boolArrayStore[key][i] = value; }
  function intUpdate(bytes32 key, uint i, int value) onlyWriter public { intArrayStore[key][i] = value; }
  function uintUpdate(bytes32 key, uint i, uint value) onlyWriter public { uintArrayStore[key][i] = value; }
  function bytesUpdate(bytes32 key, uint i, bytes value) onlyWriter public { bytesArrayStore[key][i] = value; }
  function stringUpdate(bytes32 key, uint i, string value) onlyWriter public { stringArrayStore[key][i] = value; }
  function addressUpdate(bytes32 key, uint i, address value) onlyWriter public { addressArrayStore[key][i] = value; }

  function boolPush(bytes32 key, bool value) onlyWriter public { boolArrayStore[key].push(value); }
  function intPush(bytes32 key, int value) onlyWriter public { intArrayStore[key].push(value); }
  function uintPush(bytes32 key, uint value) onlyWriter public { uintArrayStore[key].push(value); }
  function bytesPush(bytes32 key, bytes value) onlyWriter public { bytesArrayStore[key].push(value); }
  function stringPush(bytes32 key, string value) onlyWriter public { stringArrayStore[key].push(value); }
  function addressPush(bytes32 key, address value) onlyWriter public { addressArrayStore[key].push(value); }

  function boolRemove(bytes32 key, bool value) onlyWriter public {
    uint last = boolArrayStore[key].length - 1;
    for (uint i = 0; i < last; i++) {
      if (boolArrayStore[key][i] == value) {
        boolArrayStore[key][i] = boolArrayStore[key][last]; // replace with last entry
        delete boolArrayStore[key][last];
        break;
      }
    }
    boolArrayStore[key].length -= 1;
  }
  function intRemove(bytes32 key, int value) onlyWriter public {
    uint last = intArrayStore[key].length - 1;
    for (uint i = 0; i < last; i++) {
      if (intArrayStore[key][i] == value) {
        intArrayStore[key][i] = intArrayStore[key][last]; // replace with last entry
        delete intArrayStore[key][last];
        break;
      }
    }
    intArrayStore[key].length -= 1;
  }
  function uintRemove(bytes32 key, uint value) onlyWriter public {
    uint last = uintArrayStore[key].length - 1;
    for (uint i = 0; i < last; i++) {
      if (uintArrayStore[key][i] == value) {
        uintArrayStore[key][i] = uintArrayStore[key][last]; // replace with last entry
        delete uintArrayStore[key][last];
        break;
      }
    }
    uintArrayStore[key].length -= 1;
  }
  function bytesRemove(bytes32 key, bytes value) onlyWriter public {
    bytes32 hash = keccak256(value);
    uint last = bytesArrayStore[key].length - 1;
    for (uint i = 0; i < last; i++) {
      if (keccak256(bytesArrayStore[key][i]) == hash) {
        bytesArrayStore[key][i] = bytesArrayStore[key][last]; // replace with last entry
        delete bytesArrayStore[key][last];
        break;
      }
    }
    bytesArrayStore[key].length -= 1;
  }
  function stringRemove(bytes32 key, string value) onlyWriter public {
    bytes32 hash = keccak256(value);
    uint last = stringArrayStore[key].length - 1;
    for (uint i = 0; i < last; i++) {
      if (keccak256(stringArrayStore[key][i]) == hash) {
        stringArrayStore[key][i] = stringArrayStore[key][last]; // replace with last entry
        delete stringArrayStore[key][last];
        break;
      }
    }
    stringArrayStore[key].length -= 1;
  }
  function addressRemove(bytes32 key, address value) onlyWriter public {
    uint last = addressArrayStore[key].length - 1;
    for (uint i = 0; i < last; i++) {
      if (addressArrayStore[key][i] == value) {
        addressArrayStore[key][i] = addressArrayStore[key][last]; // replace with last entry
        delete addressArrayStore[key][last];
        break;
      }
    }
    addressArrayStore[key].length -= 1;
  }
}
