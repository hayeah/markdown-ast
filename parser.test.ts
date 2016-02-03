const test = require("tape");
var tapDiff = require('tap-diff');
test.createStream().pipe(tapDiff()).pipe(process.stdout);

const glob = require("glob");

import * as os from "nolang/os";
import * as io from "nolang/io";

import * as path from "path";

import {parse} from "./parser";

function exitIfError(err: Error) {
  if(err) {
    console.log(err);
    process.exit(1);
  }
}

async function checkResult(file,t) {
  var [r,err] = await os.Open(file);
  exitIfError(err);

  var [src,err] = await io.ReadFull(r);
  exitIfError(err);

  var tree = parse(src);

  var [r,err] = await os.Open(file + ".json");
  exitIfError(err);

  var [resultJSON,err] = await io.ReadFull(r);
  exitIfError(err);

  let result = JSON.parse(resultJSON);

  t.deepEqual(tree,result,`Checking ${file}`);

  t.end();
}

glob("./examples/*.md", (err,files: string[]) => {
  files.forEach(file => {
    test(path.basename(file),checkResult.bind(undefined,file));
  });
});
