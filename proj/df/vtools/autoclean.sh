#!/bin/sh
# Copyright (C) 2025  volodymyr-tsukanov  insys
# for the full copyright notice see the LICENSE file in the root of repository

# Components
npm cache clean --force

# System
apk cache clean
rm -rf /tmp/*
