#!/usr/bin/env bash

node $NODE_DEBUG_OPTION node_modules/.bin/truffle test test/contracts/**/*.spec.js
