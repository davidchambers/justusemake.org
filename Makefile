SVGO = node_modules/.bin/svgo

MAKEFILES = $(shell find src/makefiles -type f | sort)


.PHONY: build
build: index.html

index.html: src/index.html.js src/style.css src/gnu.min.svg src/grunt.min.svg lib/decorate/make.js $(MAKEFILES)
	sed -e 's:^!\(.*\)$$:\1:' -e t \
	    -e 's:":\\":g' \
	    -e 's:^\(.*\)$$:console.log("\1");:' <'$<' | node >'$@'

src/%.min.svg: src/%.svg
	$(SVGO) '$<' '$@'

src/gnu.svg:
	curl -s http://upload.wikimedia.org/wikipedia/en/2/22/Heckert_GNU_white.svg >'$@'

src/grunt.svg:
	curl -s http://gruntjs.com/img/grunt-logo.svg >'$@'


.PHONY: clean
clean:
	rm -f -- index.html src/gnu.min.svg src/grunt.min.svg


.PHONY: setup
setup:
	npm install svgo@0.4.x
