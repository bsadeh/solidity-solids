# RoleBasedExample

#### Functions
- increment() onlyOwner external
- getOwners() public view returns (address[])
- addOwner(address owner) external onlyOwner
- removeOwner(address owner) external onlyOwner

#### Events
- OwnerAdded(address indexed owner)
- OwnerRemoved(address indexed owner)

#### Members
- isOwner :   mapping(address => bool)
- version :   string
