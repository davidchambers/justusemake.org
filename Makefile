MAKEFILES = $(shell find src/makefiles -type f | sort)


index.html: src/index.html lib/decorate.js $(MAKEFILES)
	@node -e '\
var fs = require("fs");\
var decorate = require("./lib/decorate");\
\
fs.writeFileSync("$@", fs.readFileSync("$<", {encoding: "utf8"}).replace(\
  /[(]include ([^)]*)[)]/g,\
  function(match, filename) {\
    return decorate(fs.readFileSync(filename, {encoding: "utf8"}), "", []);\
  }\
));'
