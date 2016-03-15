.PHONY: build
build:
	qpack build index@node --no-source-map --output lib --no-es6

.PHONY: setup
setup:
	npm install
	quickpack setup typescript

.PHONY: watch
watch:
	quickpack build generate-examples.ts parser.test.ts --target=node --watch

.PHONY: test
test:
	(qpack build *.test.* --target node -o test -w & mocha test & wait)

