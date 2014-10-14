// split :: String -> [String]
exports.split = function(s) {
  return s.split(/[ ]+/).filter(Boolean);
};

// concat :: [a],[a] -> [a]
exports.concat = function(listA, listB) {
  return listA.concat(listB);
};

// escape :: String -> String
exports.escape = function(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
};

// last :: [a] -> a
exports.last = function(list) {
  return list[list.length - 1];
};

// butlast :: [a] -> [a]
exports.butlast = function(list) {
  return list.slice(0, -1);
};

// open :: Object -> String
exports.open = function(attrs) {
  return '<span' + Object.keys(attrs).sort().map(function(key) {
    return ' ' + key + '="' + exports.escape(attrs[key]).replace(/"/g, '&quot;') + '"';
  }).join('') + '>';
};

// close :: -> String
exports.close = function() {
  return '</span>';
};

// wrap :: Object,String -> String
exports.wrap = function(attrs, text) {
  return exports.open(attrs) + exports.escape(text) + exports.close();
};
