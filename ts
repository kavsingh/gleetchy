#!/bin/bash

npx ts-node -P './tsconfig.ts-node.json' --log-error "$@"
