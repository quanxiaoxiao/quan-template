#!/usr/bin/env node

const { Module } = require('module');
const { configDir } = require('../config');

process.env.NODE_PATH = `${__dirname}:${configDir}`;
Module._initPaths();

require('../src/cli');
