MAKEFILES = $(shell find src/makefiles -type f | sort)


.PHONY: build
build: index.html style.css

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

style.css: src/style.css src/definitions.txt
	cp '$<' '$@'
	sed 's!^\([^:]*\): \(.*\)$$!span[data-content="\1"]:hover:after { content: " -- \2"; }!' <src/definitions.txt >>'$@'
