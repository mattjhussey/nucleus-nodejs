'use strict';

var from = process.argv[2];
var to = process.argv[3];
console.log('from: ' + from);
console.log('to: ' + to);
var copyDir = require('copy-dir');

copyDir.sync(from, to);
