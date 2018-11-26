# SwitchableExample

#### Functions
- increment() whenOn external
- decrement() whenOff external
- switchOn() external onlyOwner
- getOwners() public view returns (address[])
- addOwner(address owner) external onlyOwner
- removeOwner(address owner) external onlyOwner

#### Events
- On()
- OwnerAdded(address indexed owner)
- OwnerRemoved(address indexed owner)

#### Members
- isOwner :   mapping(address => bool)
- version :   string
