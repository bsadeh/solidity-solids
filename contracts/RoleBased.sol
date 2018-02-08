pragma solidity ^0.4.18;


contract RoleBased {

  /* mapping of roles to mapping of players (role => player => bool) */
  mapping (string => mapping (address => bool)) private roles;
  mapping (string => address[]) private players;


  function RoleBased(address nominator) public {
    _addPlayer_("nominator", nominator);
  }

  modifier onlyNominator() { require(isNominator(msg.sender)); _; }
  function isNominator(address nominator) public constant returns (bool) { return isPlayer("nominator", nominator); }
  function getNominators() public constant returns (address[]) { return getPlayers("nominator"); }

  function nominate(address nominator) external { addPlayer("nominator", nominator); }
  function denominate(address nominator) external {
    removePlayer("nominator", nominator);
    require(getNominators().length > 0); // ... must have at least one nominator at all times!
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
    AddedPlayer(role, player);
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
      RemovedPlayer(role, player);
    }
  }
  event RemovedPlayer(string role, address indexed player);
}
