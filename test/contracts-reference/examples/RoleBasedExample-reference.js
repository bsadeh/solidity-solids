import {ContractReference} from '../ContractReference'


class RoleBasedExample extends ContractReference {
  constructor(nominator, version) {
    super()
    this._nominator = nominator
    this._version = version
  }
}


module.exports = {RoleBasedExample}


