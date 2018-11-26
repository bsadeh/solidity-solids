#!/usr/bin/env bash

python3 scripts/solcdog/solcdog.py -g contracts/examples/LoggableExample.sol --no-code -o docs/LoggableExample.md
python3 scripts/solcdog/solcdog.py -g contracts/examples/RoleBasedExample.sol --no-code -o docs/RoleBasedExample.md
python3 scripts/solcdog/solcdog.py -g contracts/examples/SwitchableExample.sol --no-code -o docs/SwitchableExample.md
