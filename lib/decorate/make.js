'use strict';

var _ = require('./util');


var functionNames = _.split('\
  abspath     addprefix   addsuffix   and         basename    call        \
  dir         error       eval        file        filter      filter-out  \
  findstring  firstword   flavor      foreach     guile       if          \
  info        join        lastword    notdir      or          origin      \
  patsubst    realpath    shell       sort        strip       subst       \
  suffix      value       warning     wildcard    word        wordlist    \
  words                                                                   \
');

var specialTargets = _.split('\
  .DEFAULT                .DELETE_ON_ERROR        .EXPORT_ALL_VARIABLES   \
  .IGNORE                 .INTERMEDIATE           .LOW_RESOLUTION_TIME    \
  .NOTPARALLEL            .ONESHELL               .PHONY                  \
  .POSIX                  .PRECIOUS               .SECONDARY              \
  .SECONDEXPANSION        .SILENT                 .SUFFIXES               \
');

module.exports = function recur(input, output, stack) {
  var $;
  if (input === '') {
    return output;
  } else if (/^$|\n$/.test(output) && (stack == '' || stack == '\t') && ($ = /^(\s*)(#.*)([\s\S]*)$/.exec(input))) {
    return recur($[3], output + $[1] + _.wrap({class: 'comment'}, $[2]), stack);
  } else if (/^$|\n$/.test(output) && ($ = /^(?!\t)(.+?):(?!\S)([\s\S]*)$/.exec(input))) {
    return recur($[2], output + _.open({class: 'targets'}) + $[1].split(/([ ]+)/).map(function(s, idx) {
      return idx % 2 ? s : s && _.wrap({class: specialTargets.indexOf(s) >= 0 ? 'target special' : 'target'}, s);
    }).join('') + ':' + _.close(), stack);
  } else if (/^$|\n$/.test(output) && stack == '' && ($ = /^\t([\s\S]*)$/.exec(input))) {
    return recur($[1], output + _.open({class: 'recipe'}) + '\t', _.concat(stack, ['\t']));
  } else if (_.last(stack) === '\t' && /\t$/.test(output) && ($ = /^@([\s\S]*)$/.exec(input))) {
    return recur($[1], output + _.wrap({class: 'silent'}, '@'), stack);
  } else if (_.last(stack) === "'" && ($ = /^'([\s\S]*)$/.exec(input))) {
    return recur($[1], output + "'" + _.close(), _.butlast(stack));
  } else if (_.last(stack) === '"' && ($ = /^"([\s\S]*)$/.exec(input))) {
    return recur($[1], output + '"' + _.close(), _.butlast(stack));
  } else if (_.last(stack) === '$(' && ($ = /^[)]([\s\S]*)$/.exec(input))) {
    return recur($[1], output + ')' + _.close(), _.butlast(stack));
  } else if (_.last(stack) === '${' && ($ = /^[}]([\s\S]*)$/.exec(input))) {
    return recur($[1], output + '}' + _.close(), _.butlast(stack));
  } else if (_.last(stack) === '\t' && ($ = /^\n(?!\t)([\s\S]*)$/.exec(input))) {
    return recur($[1], output + _.close() + '\n', _.butlast(stack));
  } else if (_.last(stack) !== "'" && _.last(stack) !== '"' && ($ = /^('|")([\s\S]*)$/.exec(input))) {
    return recur($[2], output + _.open({class: 'string'}) + $[1], _.concat(stack, [$[1]]));
  } else if (($ = /^([$][@%<?^+|*]|[$][(][@%<?^+*][DF][)])([\s\S]*)$/.exec(input))) {
    return recur($[2], output + _.wrap({class: 'auto-var', 'data-content': $[1]}, $[1]), stack);
  } else if (($ = /^([$][({])([^ ]*)([\s\S]*)$/.exec(input))) {
    return functionNames.indexOf($[2]) >= 0 ?
      recur($[3], output + _.open({class: 'group'}) + $[1] + _.wrap({class: 'function'}, $[2]), _.concat(stack, [$[1]])) :
      recur($[2] + $[3], output + _.open({class: 'group'}) + $[1], _.concat(stack, [$[1]]));
  } else {
    return recur(input.slice(1), output + _.escape(input[0]), stack);
  }
};
