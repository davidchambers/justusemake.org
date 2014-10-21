'use strict';

var _ = require('./util');


module.exports = function(input) {
  return input
  .split(/^[$] (.*)\n?/m)
  .map(function(chunk, idx) {
    if (chunk === '') {
      return '';
    } else if (idx % 2) {
      return '<span class="prompt">$</span> <span class="command">' + _.escape(chunk) + '</span>\n';
    } else {
      return '<span class="output">' + _.escape(chunk).replace(/\n(?=\s*$)/, '\n</span>');
    }
  })
  .join('');
};
