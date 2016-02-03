This project uses [QuickPack](https://github.com/hayeah/quickpack) as build tool. Install it first.

# Hacking Guide

Install dependencies, and setup project for typescript:

```
make setup
```

After make setup, you should be able to use vscode with Intellisense.

Build and watch the project

```
make watch
```

Run test to compare the parse result of `examples/[file].md` against `examples/[file].md.json`

```
make test
```

If you changed the parser, regenerate the parse result:

```
node build/generate-examples.js examples/list.md
```

Regenerate all the examples:

```
node build/generate-examples.js
```

