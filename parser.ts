// let sectionize = require("./sectionize");

let {lexer} = require("marked");
let {makeEnsureUnique} = require("./utils");

import * as ast from "./ast";
import * as tk from "./token";

import {parseInline} from "./inline";

import {Node} from "./ast";
const {NodeTypes} = ast;

import { parseXMLHeredoc } from "./parseXMLHeredoc";

export default parse;

export function parse(src: string): ast.Section[] {
  let tokens = tokenize(src);
  let sections = _parse(tokens);
  return sections;
}

export function tokenize(src: string): tk.Token[] {
  return lexer(src);
}

function _parse(tokens: tk.Token[]): ast.Section[] {
  let sections: ast.Section[] = [];

  let ensureUnique = makeEnsureUnique();

  // dup tokens
  tokens = tokens.reverse();
  function popToken(): tk.Token {
    return tokens.pop();
  }

  function peekToken(): tk.Token {
    if (tokens.length == 0) {
      return null;
    }
    return tokens[tokens.length - 1];
  }

  function parseListItem(): ast.ListItem {
    const start = <tk.ListItemStartToken> popToken();



    let children;
    let looseItem = false;


    if(start.type === tk.Types.loose_item_start) {
      looseItem = true;
      // Kludgy handling of "loose items". The tokens returned by the lexer are messy to begin with.
      children = parseContent(tk.Types.list_item_end, [], true).map(node => {
        if(typeof node === "string") {
          // Add space to prevent text strings from being joined together.
          return `${node} `;
        } else {
          if(node.type === "space") {
            const newline: ast.NewLine = {
              type: "newline",
            };

            return newline;
          } else {
            return node;
          }
        }
      });
    } else {
      children = parseContent(tk.Types.list_item_end);
    }


    popToken(); // list_item_end

    return {
      type: NodeTypes.list_item,
      children,
      isBlock: looseItem,
    };
  }


  function parseList(): ast.List {
    // "list_start"
    let {ordered} = <tk.ListStart>popToken();


    let items = [];
    while (tokens.length > 0) {
      let token = peekToken();
      let {type} = token;

      if (type === tk.Types.list_end) {
        popToken();
        break;
      } else if (tk.isListItemStartToken(token)) {
        items.push(parseListItem());
      }
    }

    return { type: NodeTypes.list, ordered, items };
  }

  function parseBlockQuote(): ast.BlockQuote {

    popToken(); // blockquote_start
    let children = parseContent(tk.Types.blockquote_end);
    popToken(); // blockquote_end

    return {
      type: "blockquote",
      children,
    };
  }

  function parseSection(): ast.Section {
    let token = peekToken();

    let id: string;

    let heading: ast.Heading;
    let content: Node[] = [];

    if (token.type === tk.Types.heading) {
      let headingToken = <tk.Heading>token;
      heading = parseHeading();
      id = heading.id;
      content.push(heading);
    } else {
      id = "_top";
    }

    parseContent(ast.NodeTypes.heading, content);

    return {
      type: NodeTypes.section,
      children: content,
      id,
    }
  }

  function parseHeading(): ast.Heading {
    let token = <tk.Heading>tokens.pop();
    let id = ensureUnique(token.text)

    return {
      id,
      type: ast.NodeTypes.heading,
      depth: token.depth,
      text: token.text,
    };
  }

  function parseParagraph(): ast.Paragraph {
    let token = <tk.Paragraph>tokens.pop();

    return {
      type: "paragraph",
      children: parseInline(token.text),
    }
  }

  // Treat uppercase HTML tags as components. Parse text content recursively.
  function parseComponent(): ast.JSX {
    const { text } = <tk.HTML> tokens.pop();
    const [doc, _] = parseXMLHeredoc(text);
    const { tag, attrs, content } = doc;

    const node: ast.JSX = {
      type: "jsx",
      name: tag,
      attrs,
    }

    if(content) {
      node.sections = parse(content);
    }

    return node;
  }

  function parseContent(endType: string, content: ast.Children = [], preserveSpace: boolean = false): ast.Children {
    // let content: Node[] = [];
    while (true) {
      let token = peekToken();

      if (token == null) {
        return content;
      }

      if (token.type == endType) {
        return content
      }

      // Get rid of space, except when it matters (list items...)
      if (token.type === "space" && !preserveSpace) {
        tokens.pop();
        continue;
      }

      if (tk.isListStartToken(token)) {
        content.push(parseList());
      } else if (tk.isText(token)) {
        tokens.pop();
        let children = parseInline(token.text);
        content.push(...children);
      } else if (token.type === tk.Types.paragraph) {
        content.push(parseParagraph());
      } else if (token.type === tk.Types.heading) {
        content.push(parseHeading());
      } else if (token.type === tk.Types.blockquote_start) {
        content.push(parseBlockQuote());
      } else if (token.type === tk.Types.html) {
        const { text } = <tk.HTML> token;
        if(text.match(/^<[A-Z]/)) {
          // treat uppercase tags as components
          content.push(parseComponent());
        } else {
          // normal html node
          const tk = <tk.HTML> tokens.pop();

          const node: ast.HTML = {
            type: 'html',
            inline: false,
            pre: true,
            text: tk.text,
          };

          content.push(node);
        }

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
