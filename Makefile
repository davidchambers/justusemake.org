MAKEFILES = $(shell find src/makefiles -type f | sort)


.PHONY: build
build: index.html

index.html: src/index.html.js lib/decorate/make.js $(MAKEFILES)
	sed -e 's:^!$$::' -e t \
	    -e 's:^! \(.*\)$$:\1:' -e t \
	    -e 's:^!=\(.*\)$$:console.log(\1);:' -e t \
	    -e 's:":\\":g' \
	    -e 's:^\(.*\)$$:console.log("\1");:' <'$<' | node >'$@'


.PHONY: clean
clean:
	rm -f -- index.html
