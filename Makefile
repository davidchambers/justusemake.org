MAKEFILES = $(shell find src/makefiles -type f | sort)


index.html: src/index.html scripts/highlight $(MAKEFILES)
	scripts/highlight '$<' >'$@'
