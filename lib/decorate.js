'use strict';


// split :: String -> [String]
function split(s) {
  return s.split(/[ ]+/).filter(Boolean);
}

var functionNames = split('\
  abspath     addprefix   addsuffix   and         basename    call        \
  dir         error       eval        file        filter      filter-out  \
  findstring  firstword   flavor      foreach     guile       if          \
  info        join        lastword    notdir      or          origin      \
  patsubst    realpath    shell       sort        strip       subst       \
  suffix      value       warning     wildcard    word        wordlist    \
  words                                                                   \
');

var specialTargets = split('\
  .DEFAULT                .DELETE_ON_ERROR        .EXPORT_ALL_VARIABLES   \
  .IGNORE                 .INTERMEDIATE           .LOW_RESOLUTION_TIME    \
  .NOTPARALLEL            .ONESHELL               .PHONY                  \
  .POSIX                  .PRECIOUS               .SECONDARY              \
  .SECONDEXPANSION        .SILENT                 .SUFFIXES               \
');

var autoVars = {
  '$@': 'The name of the target of the rule',
  '$%': 'The target member name, when the target is an archive member',
  '$<': 'The name of the first prerequisite',
  '$?': 'The names of all the prerequisites that are newer than the target, with spaces between them',
  '$^': 'The names of all the prerequisites, with spaces between them',
  '$+': 'The names of all the prerequisites, with duplicates removed',
  '$|': 'The names of all the order-only prerequisites, with spaces between them',
  '$*': 'The stem with which an implicit rule matches',
  '$(@D)': 'The directory part of the name of the target, with the trailing slash removed',
  '$(%D)': 'The directory part of the target archive member name',
  '$(<D)': 'The directory part of the first prerequisite',
  '$(?D)': 'Lists of the directory parts of all prerequisites that are newer than the target',
  '$(^D)': 'Lists of the directory parts of all prerequisites',
  '$(+D)': 'Lists of the directory parts of all prerequisites, including multiple instances of duplicated prerequisites',
  '$(*D)': 'The directory part of the stem',
  '$(@F)': 'The file-within-directory part of the name of the target',
  '$(%F)': 'The file-within-directory part of the target archive member name',
  '$(<F)': 'The file-within-directory part of the first prerequisite',
  '$(?F)': 'Lists of the file-within-directory parts of all prerequisites that are newer than the target',
  '$(^F)': 'Lists of the file-within-directory parts of all prerequisites',
  '$(+F)': 'Lists of the file-within-directory parts of all prerequisites, including multiple instances of duplicated prerequisites',
  '$(*F)': 'The file-within-directory part of the stem',
};

module.exports = function recur(input, output, stack) {
  var $;
  if (input === '') {
    return output;
  } else if (/^$|\n$/.test(output) && (stack == '' || stack == '\t') && ($ = /^(\s*)(#.*)([\s\S]*)$/.exec(input))) {
    return recur($[3], output + $[1] + wrap({class: 'comment'}, $[2]), stack);
  } else if (/^$|\n$/.test(output) && ($ = /^(?!\t)(.+?):(?!\S)([\s\S]*)$/.exec(input))) {
    return recur($[2], output + open({class: 'targets'}) + $[1].split(/([ ]+)/).map(function(s, idx) {
      return idx % 2 ? s : s && wrap({class: specialTargets.indexOf(s) >= 0 ? 'target special' : 'target'}, s);
    }).join('') + ':' + close(), stack);
  } else if (/^$|\n$/.test(output) && stack == '' && ($ = /^\t([\s\S]*)$/.exec(input))) {
    return recur($[1], output + open({class: 'recipe'}) + '\t', concat(stack, ['\t']));
  } else if (last(stack) === '\t' && /\t$/.test(output) && ($ = /^@([\s\S]*)$/.exec(input))) {
    return recur($[1], output + wrap({class: 'silent'}, '@'), stack);
  } else if (last(stack) === "'" && ($ = /^'([\s\S]*)$/.exec(input))) {
    return recur($[1], output + "'" + close(), butlast(stack));
  } else if (last(stack) === '"' && ($ = /^"([\s\S]*)$/.exec(input))) {
    return recur($[1], output + '"' + close(), butlast(stack));
  } else if (last(stack) === '$(' && ($ = /^[)]([\s\S]*)$/.exec(input))) {
    return recur($[1], output + ')' + close(), butlast(stack));
  } else if (last(stack) === '${' && ($ = /^[}]([\s\S]*)$/.exec(input))) {
    return recur($[1], output + '}' + close(), butlast(stack));
  } else if (last(stack) === '\t' && ($ = /^\n(?!\t)([\s\S]*)$/.exec(input))) {
    return recur($[1], output + close() + '\n', butlast(stack));
  } else if (last(stack) !== "'" && last(stack) !== '"' && ($ = /^('|")([\s\S]*)$/.exec(input))) {
    return recur($[2], output + open({class: 'string'}) + $[1], concat(stack, [$[1]]));
  } else if (($ = /^([$][@%<?^+|*]|[$][(][@%<?^+*][DF][)])([\s\S]*)$/.exec(input))) {
    return recur($[2], output + wrap({class: 'auto-var', title: autoVars[$[1]]}, $[1]), stack);
  } else if (($ = /^([$][({])([^ ]*)([\s\S]*)$/.exec(input))) {
    return functionNames.indexOf($[2]) >= 0 ?
      recur($[3], output + open({class: 'group'}) + $[1] + wrap({class: 'function'}, $[2]), concat(stack, [$[1]])) :
      recur($[2] + $[3], output + open({class: 'group'}) + $[1], concat(stack, [$[1]]));
  } else {
    return recur(input.slice(1), output + escape(input[0]), stack);
  }
};

// concat :: [a],[a] -> [a]
function concat(listA, listB) {
  return listA.concat(listB);
}

// escape :: String -> String
function escape(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// last :: [a] -> a
function last(list) {
  return list[list.length - 1];
}

// butlast :: [a] -> [a]
function butlast(list) {
  return list.slice(0, -1);
}

// open :: Object -> String
function open(attrs) {
  return '<span' + Object.keys(attrs).sort().map(function(key) {
    return ' ' + key + '="' + escape(attrs[key]).replace(/"/g, '&quot;') + '"';
  }).join('') + '>';
}

// close :: -> String
function close() {
  return '</span>';
}

// wrap :: Object,String -> String
function wrap(attrs, text) {
  return open(attrs) + escape(text) + close();
}
