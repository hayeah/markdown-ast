const glob = require("glob");

import { parse } from "./parser";

import * as qfs from "q-io/fs";

import * as path from "path";

main();

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
    for (let file of files) {
      await generateOutputForExample(file);
    }
  } catch(err) {
    console.log(err);
    process.exit(1);
  }
}

async function generateOutputForExample(file: string) {
  const outputFile = `${file}.json`;

  const src: string = await qfs.read(file);
  const ast = parse(src);

  const output = JSON.stringify(ast, null, 2);
  await qfs.write(outputFile, output)

  return;
}