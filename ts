#!/bin/bash

npx ts-node -P './tsconfig.node.json' --log-error "$@"
