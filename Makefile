MAKEFILES = $(shell find src/makefiles -type f | sort)


.PHONY: build
build: index.html style.css

index.html: src/index.html lib/decorate/make.js $(MAKEFILES)
	@node <<<'var fs = require("fs");\
\
fs.writeFileSync("$@", fs.readFileSync("$<", {encoding: "utf8"}).replace(\
  /[(]include :language ([^ ]*) ([^)]*)[)]/g,\
  function(match, language, filename) {\
    var input = fs.readFileSync(filename, {encoding: "utf8"});\
    var output = require("./lib/decorate/" + language)(input, "", []);\
    return "<pre><code class=\"language-" + language + "\">" + output + "</code></pre>";\
  }\
));'

style.css: src/style.css src/definitions.txt
	cp '$<' '$@'
	sed 's!^\([^:]*\): \(.*\)$$!span[data-content="\1"]:hover:after { content: " -- \2"; }!' <src/definitions.txt >>'$@'


.PHONY: clean
clean:
	rm -f -- index.html style.css
