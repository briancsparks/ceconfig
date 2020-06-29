#!/usr/bin/env node

const mkARGV      = require('../lib/argv');

//const ARGV        = mkARGV(null, {arrayNames: {bar:true, bar2:true, barty:true}});
const ARGV        = mkARGV();

//const CONFIG      = require('..').mkCONFIG({project:'xyzconfig', arrayNames: {bar:true, bar2:true, barty:true}});
const CONFIG      = require('..').mkCONFIG();


console.log(CONFIG(ARGV._[0] || ''));


