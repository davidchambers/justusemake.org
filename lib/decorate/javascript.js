'use strict';

var _ = require('./util');


var keywords = _.split('\
  break       case        catch       continue    debugger    default     \
  delete      do          else        finally     for         function    \
  if          in          instanceof  new         return      switch      \
  this        throw       try         typeof      var         void        \
  while       with                                                        \
');

module.exports = function recur(input, output, stack) {
  var $;
  if (input === '') {
    return output;
  } else if (($ = /^(['"])([\s\S]*)$/.exec(input)) && stack == '') {
    return recur($[2], output + _.open({class: 'string'}) + $[1], [$[1]]);
  } else if (($ = /^(['"])([\s\S]*)$/.exec(input)) && $[1] == stack) {
    return recur($[2], output + $[1] + _.close(), []);
  } else if (stack == '' && !/[$_A-Za-z0-9]$/.test(output) && ($ = /^([A-Za-z0-9.]+)\b([\s\S]*)$/.exec(input))) {
    return (
      keywords.indexOf($[1]) >= 0 ?
        recur($[2], output + _.wrap({class: 'keyword'}, $[1]), stack) :
      ['true', 'false', 'null', 'undefined'].indexOf($[1]) >= 0 ?
        recur($[2], output + _.wrap({class: 'special-value'}, $[1]), stack) :
      /^(Infinity|NaN|\d+([.]\d+)?)$/.test($[1]) ?
        recur($[2], output + _.wrap({class: 'number'}, $[1]), stack) :
      // else
        recur($[2], output + _.escape($[1]), stack)
    );
  } else {
    return recur(input.slice(1), output + _.escape(input[0]), stack);
  }
};
