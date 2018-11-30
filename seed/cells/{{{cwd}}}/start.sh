#!/bin/bash

. ~/.nvm/nvm.sh
nvm use $1
export SIBLING_INDEX=$3
node index.js $2
