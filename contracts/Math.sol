pragma solidity 0.4.24;


/* @title Math provides arithmetic functions for uint type pairs.
  You can safely `plus`, `minus`, `times`, and `divide` uint numbers without fear of integer overflow.
  You can also find the `min` and `max` of two numbers.
*/
library Math {

  function min(uint x, uint y) internal pure returns (uint) { return x <= y ? x : y; }
  function max(uint x, uint y) internal pure returns (uint) { return x >= y ? x : y; }


  /** @dev adds two numbers, reverts on overflow */
  function plus(uint x, uint y) internal pure returns (uint z) { require((z = x + y) >= x, "bad addition"); }

  /** @dev subtracts two numbers, reverts on overflow (i.e. if subtrahend is greater than minuend) */
  function minus(uint x, uint y) internal pure returns (uint z) { require((z = x - y) <= x, "bad subtraction"); }


  /** @dev multiplies two numbers, reverts on overflow */
  function times(uint x, uint y) internal pure returns (uint z) { require(y == 0 || (z = x * y) / y == x, "bad multiplication"); }

  /** @dev divides two numbers and returns the remainder (unsigned integer modulo), reverts when dividing by zero */
  function mod(uint x, uint y) internal pure returns (uint z) {
    require(y != 0, "bad modulo; using 0 as divisor");
    z = x % y;
  }

  /** @dev integer division of two numbers, reverts if x % y != 0 */
  function dividePerfectlyBy(uint x, uint y) internal pure returns (uint z) {
    require((z = x / y) * y == x, "bad division; leaving a reminder");
  }

}
