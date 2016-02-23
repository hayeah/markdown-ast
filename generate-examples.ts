const glob = require("glob");

import "babel-polyfill";
import * as os from "nolang/os";
import * as io from "nolang/io";

import {parse} from "./parser";

import * as path from "path";

main();

function exitIfError(err: Error) {
  if (err) {

    console.log(err);
    if(err.stack) {
      console.log(err.stack);
    }
    process.exit(1);
  }
}

async function getExampleFiles(): Promise<string[]> {
  let files = process.argv.slice(2);

  if (files.length > 0) {
    return files;
  }

  return new Promise<string[]>((resolve, reject) => {
    glob("./examples/*.md", (err, files: string[]) => {
      if(err) {
        reject(err);
        return;
      }

      resolve(files);
    });
  });
}

async function main() {
  try {
    let files = await getExampleFiles();
    console.log("generate test output for", files);
    files.forEach(generateOutputForExample);
  } catch(err) {
    exitIfError(err);
  }
}

async function generateOutputForExample(file: string) {
  var [r, err] = await os.Open(file);
  exitIfError(err);

  var [src, err] = await io.ReadFull(r);
  exitIfError(err);

  try {
    var tree = parse(src);
  } catch(err) {
    exitIfError(err);
  }


  var [w, err] = await os.Create(file + ".json");
  exitIfError(err);

  w.Write(JSON.stringify(tree, null, 2))

  var err = await w.Close();
  exitIfError(err);
}