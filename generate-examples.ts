const glob = require("glob");

import * as os from "nolang/os";
import * as io from "nolang/io";

import {compile} from "./markdown";

import * as path from "path";

function exitIfError(err: Error) {
  if(err) {
    console.log(err);
    process.exit(1);
  }
}

glob("./examples/*.md", (err,files: string[]) => {
  files.forEach(async (file) => {
    var [r,err] = await os.Open(file);
    exitIfError(err);

    var [src,err] = await io.ReadFull(r);
    exitIfError(err);

    var tree = compile(src);

    var [w,err] = await os.Create(file + ".json");
    exitIfError(err);

    w.Write(JSON.stringify(tree,null,2))

    var err = await w.Close();
    exitIfError(err);
  })
});