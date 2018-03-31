pragma solidity ^0.4.19;


/*
  a general purpose role-based access control.
  intended to be mixed-in, but specialized roles would have more clarity (e.g.: HasOwners)
*/
contract RoleBased {
  string constant private nominator = "nominator";

  /* mapping of roles to mapping of players (role => player => bool) */
  mapping (string => mapping (address => bool)) private roles;
  mapping (string => address[]) private players;


  function RoleBased(address subject) public {
    _addPlayer_(nominator, subject);
  }

  modifier onlyNominator() { require(isNominator(msg.sender)); _; }
  function isNominator(address subject) public constant returns (bool) { return isPlayer(nominator, subject); }
  function getNominators() public constant returns (address[]) { return getPlayers(nominator); }

  function nominate(address subject) external { addPlayer(nominator, subject); }
  function denominate(address subject) external {
    removePlayer(nominator, subject);
    require(getNominators().length > 0); // ... must have at least one subject at all times!
  }


  modifier onlyRole(string role) { require(isPlayer(role, msg.sender)); _; }
  function isPlayer(string role, address player) public constant returns (bool) { return roles[role][player]; }
  function getPlayers(string role) public constant returns (address[]) { return players[role]; }

  function addPlayer(string role, address player) public onlyNominator {
    if (!isPlayer(role, player)) _addPlayer_(role, player);
  }

  function _addPlayer_(string role, address player) private {
    roles[role][player] = true;
    players[role].push(player);
    emit AddedPlayer(role, player);
  }
  event AddedPlayer(string role, address indexed player);

  function removePlayer(string role, address player) public onlyNominator {
    if (isPlayer(role, player)) {
      roles[role][player] = false;
      uint last = players[role].length - 1;
      for (uint i = 0; i < last; i++) {
        if (players[role][i] == player) {
          players[role][i] = players[role][last]; // replace with last entry
          delete players[role][last];
          break;
        }
      }
      players[role].length -= 1;
      emit RemovedPlayer(role, player);
    }
  }
  event RemovedPlayer(string role, address indexed player);
}
