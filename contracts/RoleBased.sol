pragma solidity ^0.4.18;


contract RoleBased {
  event AddedPlayer(string role, address indexed player);
  event RemovedPlayer(string role, address indexed player);

  /* mapping of roles to mapping of players (role => player => bool) */
  mapping (string => mapping (address => bool)) private roles;
  mapping (string => address[]) private players;

  modifier onlyRole(string role) { require(isPlayer(role, tx.origin)); _; }

  function isPlayer(string role, address player) public constant returns (bool) { return roles[role][player]; }
  function getPlayers(string role) public constant returns (address[]) { return players[role]; }

  function setPlayers(string role, address[] _players) internal {
    for (uint i = 0; i < _players.length; i++) {
      roles[role][_players[i]] = true;
      AddedPlayer(role, _players[i]);
    }
    players[role] = _players;
  }

  function addPlayer(string role, address player) public onlyRole(role) {
    if (!isPlayer(role, player)) {
      roles[role][player] = true;
      players[role].push(player);
      AddedPlayer(role, player);
    }
  }

  function removePlayer(string role, address player) public onlyRole(role) {
    if (isPlayer(role, player)) {
      require(players[role].length > 1); // => never be left with no players!
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
}
