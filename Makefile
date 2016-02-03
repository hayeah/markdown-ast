.PHONY: setup
setup:
  npm install
  quickpack setup typescript

.PHONY: watch
watch:
  quickpack build generate-examples.ts parser.test.ts --target=node --watch

.PHONY: test
test:
  node build/parser.test.js

