#!/usr/bin/env node

const util        = require('util');
const mkARGV      = require('../lib/argv');
const ARGV        = mkARGV();

const project     = ARGV.extract('project');

var   ARGV2, ARGV3;

if (ARGV.__) {
  ARGV2 = mkARGV(ARGV.__);
}

if (ARGV.___) {
  ARGV3 = mkARGV(ARGV.extract('___'));
}

console.log(inspect({project, ARGV, ARGV2, ARGV3}));

function inspect(x) {
  return util.inspect(x, {depth:null, colors:true});
}

