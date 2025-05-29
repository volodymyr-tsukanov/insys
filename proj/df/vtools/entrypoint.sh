#!/bin/sh
# Copyright (C) 2025  volodymyr-tsukanov  insys
# for the full copyright notice see the LICENSE file in the root of repository
timestamp=$(date +"%d/%m/%Y %H:%M:%S")
file_setup=".setup.done.tmp"
cd /home/app
if [ ! -f $file_setup ]; then 
    npm install
    echo "$timestamp" > $file_setup
fi
npm run dev