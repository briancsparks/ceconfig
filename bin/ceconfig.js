#!/usr/bin/env node

/**
 *  The CLI command for ceconfig.
 *
 *  Get adj
 *  ceconfig get adj
 *
 */

const mkARGV          = require('../lib/argv');
const ARGV            = mkARGV();
const cmd             = ARGV.shift();

const cmdFn           = require(`./cmds/${cmd}`);

cmdFn(ARGV);

