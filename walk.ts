import * as ast from "./ast";

// depth first walk
export function walk(node: ast.Node | string, fn: (node: ast.Node | string) => void) {
  if(ast.isContentNode(node)) {
    fn(node);
    node.children.forEach(child => {
      walk(child, fn);
    });
  } else {
    fn(node);
  }
}