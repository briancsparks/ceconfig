#!/usr/bin/env node

const mkARGV      = require('../lib/argv');
const CONFIG      = require('..').mkCONFIG({project:'xyzconfig', arrayNames: {bar:true, bar2:true, barty:true}});

const ARGV        = mkARGV();
//const ARGV        = mkARGV(null, {arrayNames: {bar:true, bar2:true, barty:true}});

//console.log(CONFIG);
console.log(CONFIG(ARGV._[0] || ''));


