'use strict';

const businessDashboard = require('..');
const assert = require('assert').strict;

assert.strictEqual(businessDashboard(), 'Hello from businessDashboard');
console.info('businessDashboard tests passed');
