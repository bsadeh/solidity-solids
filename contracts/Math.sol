pragma solidity ^0.4.21;


/* Math provides arithmetic functions for uint type pairs.
  You can safely `add`, `subtract`, and `times` uint numbers without fear of integer overflow.
  There is no `divide`, as divide-by-zero checking is built into the Solidity compiler.
  You can also find the `min` and `max` of two numbers.
*/
library Math {

  function plus(uint x, uint y) internal pure returns (uint z) { require((z = x + y) >= x); }
  function minus(uint x, uint y) internal pure returns (uint z) { require((z = x - y) <= x); }

  function times(uint x, uint y) internal pure returns (uint z) { require(y == 0 || (z = x * y) / y == x); }

  function min(uint x, uint y) internal pure returns (uint) { return x <= y ? x : y; }
  function max(uint x, uint y) internal pure returns (uint) { return x >= y ? x : y; }
}
