// let sectionize = require("./sectionize");

let {lexer} = require("marked");
let {makeEnsureUnique} = require("./utils");

import * as ast from "./ast";
import {Node, Token} from "./ast";
const {NodeTypes, TokenTypes} = ast;

export default compile;

export function compile(src: string): ast.Section[] {
  let tokens = tokenize(src);
  let sections = parse(tokens);
  return sections;
}

export function tokenize(md: string): ast.Token[] {
  return lexer(md);
}

export function parse(tokens: ast.Token[]): ast.Section[] {
  let sections: ast.Section[] = [];

  let ensureUnique = makeEnsureUnique();

  // dup tokens
  tokens = tokens.reverse();
  function popToken(): Token {
    return tokens.pop();
  }

  function peekToken(): Token {
    if(tokens.length == 0) {
      return null;
    }
    return tokens[tokens.length - 1];
  }

  function parseListItem(): ast.ListItem {
    popToken(); // "list_item_start"

    let children = parseContent(TokenTypes.list_item_end);
    popToken(); // list_item_end

    return { type: NodeTypes.list_item, children };
  }


  function parseList(): ast.List {
    // "list_start"
    let {ordered} = <ast.ListStartToken> popToken();


    let items = [];
    while (tokens.length > 0) {
      let token = peekToken();
      let {type} = token;

      if (type === TokenTypes.list_end) {
        popToken();
        break;
      } else if (ast.isListItemStartToken(token)) {
        items.push(parseListItem());
      }
    }

    return { type: NodeTypes.list, ordered, items };
  }

  function parseBlockQuote(): ast.BlockQuote {
    popToken(); // blockquote_start
    let content = parseContent(ast.TokenTypes.blockquote_end);
    popToken(); // blockquote_end
    return {
      type: ast.NodeTypes.blockquote,
      content,
    };
  }

  function parseSection(): ast.Section {
    let token = peekToken();

    let id: string;

    let heading: ast.Heading;
    let content: Node[] = [];

    if (token.type === TokenTypes.heading) {
      let headingToken = <ast.HeadingToken> token;
      heading = parseHeading();
      id = heading.id;
      content.push(heading);
    } else {
      id = "_top";
    }

    parseContent(ast.NodeTypes.heading,content);

    return {
      type: NodeTypes.section,
      children: content,
      id,
    }
  }

  function parseHeading(): ast.Heading {
    let token  = <ast.HeadingToken> tokens.pop();
    let id = ensureUnique(token.text)

    return {
      id,
      type: ast.NodeTypes.heading,
      depth: token.depth,
      text: token.text,
    };
  }



  function parseContent(endType: string, content: Node[] = []): Node[] {
    // let content: Node[] = [];
    while(true) {
      let token = peekToken();

      if(token == null) {
        return content;
      }

      if(token.type == endType) {
        return content
      }

      // wtf? get rid of space
      if(token.type === "space") {
        tokens.pop();
        continue;
      }

      if (ast.isListStartToken(token)) {
        content.push(parseList());
      } else if(token.type === ast.TokenTypes.heading) {
        content.push(parseHeading());
      } else if(token.type === ast.TokenTypes.blockquote_start) {
        content.push(parseBlockQuote());
      } else {
        content.push(tokens.pop());
      }
    }
  }

  while (tokens.length > 0) {
    sections.push(parseSection())
  }

  // createSection();

  return sections;
}
