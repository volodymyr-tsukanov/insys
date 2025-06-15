#!/bin/sh
# Copyright (C) 2025  volodymyr-tsukanov  insys
# for the full copyright notice see the LICENSE file in the root of repository

timestamp=$(date +"%d/%m/%Y %H:%M:%S")
file_setup=".setup.done.tmp"
cd /home/app
if [ ! -d node_modules ] || [ ! -f "$file_setup" ]; then
    echo "[INFO] Installing dependencies..."
    npm install
    echo "$timestamp" > "$file_setup"
else
    echo "[INFO] Dependencies already installed. Skipping npm install."
fi

npm run dev
