index.html: src/index.html src/EXAMPLE_1 scripts/highlight
	@sed 's/EXAMPLE_1/$(shell scripts/highlight src/EXAMPLE_1 \
	| tr '\n' $$'\x1A' | sed -e 's:%:%25:g' -e "s:':%27:g" -e 's:/:%2F:g' -e 's:&:\\&:g')/' '$<' \
	| tr $$'\x1A' '\n' | sed -e 's:%2F:/:g' -e "s:%27:':g" -e 's:%25:%:g' >'$@'
