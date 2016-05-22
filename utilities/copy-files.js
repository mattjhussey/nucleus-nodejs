'use strict';

var copyDir = require('copy-dir');

copyDir.sync(process.argv[2], process.argv[3]);
