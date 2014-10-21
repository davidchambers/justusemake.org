MAKEFILES = $(shell find src/makefiles -type f | sort)


.PHONY: build
build: index.html style.css

index.html: src/index.html lib/decorate/make.js $(MAKEFILES)
	sed -e 's:^!$$::' -e t \
	    -e 's:^! \(.*\)$$:\1:' -e t \
	    -e 's:^!=\(.*\)$$:console.log(\1);:' -e t \
	    -e 's:":\\":g' \
	    -e 's:^\(.*\)$$:console.log("\1");:' <'$<' | node >'$@'

style.css: src/style.css src/definitions.txt
	cp '$<' '$@'
	sed 's!^\([^:]*\): \(.*\)$$!span[data-content="\1"]:hover:after { content: " -- \2"; }!' <src/definitions.txt >>'$@'


.PHONY: clean
clean:
	rm -f -- index.html style.css
