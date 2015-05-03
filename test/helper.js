var chai = require('chai');
var sinon = require('sinon');

global.expect = chai.expect;
global.sinon = sinon;

// clear console
require('util').print("\u001b[2J\u001b[0;0H");
