import { assert } from "chai";

const glob = require("glob");

import * as os from "nolang/os";
import * as io from "nolang/io";

import * as path from "path";

import {parse} from "./parser";

function checkError(err: Error) {
  if (err) {
    throw err;
  }
}

async function checkResult(file, test) {
  var [r, err] = await os.Open(file);
  checkError(err);

  var [src, err] = await io.ReadFull(r);
  checkError(err);

  var tree = parse(src);

  var [r, err] = await os.Open(file + ".json");
  checkError(err);

  var [resultJSON, err] = await io.ReadFull(r);
  checkError(err);

  let result = JSON.parse(resultJSON);

  test(tree, result);
}

const examples: string[] = glob.sync("./examples/*.md");

describe("parser", () => {
  examples.forEach(example => {
    it(`parses ${path.basename(example)}`, () => {
      return checkResult(example, assert.deepEqual);
    });
  });
});
