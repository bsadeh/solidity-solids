import {ContractReference} from '../ContractReference'


class SwitchableExample extends ContractReference {
  constructor(nominator, version) {
    super()
    this._nominator = nominator
    this._version = version
    this._isOn = true
  }

  /**************************************************** Switchable ****************************************************/

  whenOff() { this.__require__(!this._isOn) }
  whenOn() { this.__require__(this._isOn) }

  async isOn() { return this._isOn }

  async switchOff(msg) {
    // this.onlyOwner(msg)
    if (this._isOn) {
      this._isOn = false
      return this.emit(new Off())
    }
  }

  async switchOn(msg) {
    // this.onlyOwner(msg)
    if (!this._isOn) {
      this._isOn = true
      return this.emit(new On())
    }
  }

  /********************************************************* **********************************************************/
}


class On {}

class Off {}


module.exports = {SwitchableExample}


