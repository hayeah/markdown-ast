// let sectionize = require("./sectionize");

let {lexer} = require("marked");
let {makeEnsureUnique} = require("./utils");

import * as ast from "./ast";
import * as tk from "./token";

import { parseInline } from "./inline";

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

  // Reverse and dupplicate tokens. Use `pop` to get the next token.
  tokens = tokens.reverse();

  function popToken(): tk.Token {
    const token = tokens.pop();
    if (token == null) {
      throw new Error("End of input");
    }
    return token;
  }

  function peekToken(): tk.Token | null {
    if (tokens.length == 0) {
      return null;
    }
    return tokens[tokens.length - 1];
  }

  function assertPopToken(context: string, acceptableTypes: string[]) {
    const token = popToken();
    assertTokenType(context, token, acceptableTypes);
    return token;
  }

  function assertTokenType(context: string, token: tk.Token, acceptableTypes: string[]): void {
    if (acceptableTypes.indexOf(token.type) === -1) {
      throw new Error(`Parsing ${context}. Expected ${acceptableTypes}. Got ${token.type}`);
    }
  }

  function parseListItem(): ast.ListItem {
    const start = <tk.ListItemStart | tk.ListLooseItemStart> assertPopToken("ListItem", [
      tk.Types.list_item_start,
      tk.Types.loose_item_start
    ]);

    let children: ast.Children;
    let isBlock = false;

    if (start.type === tk.Types.loose_item_start) {
      isBlock = true;
      // Kludgy handling of "loose items". The tokens returned by the lexer are messy to begin with.
      children = parseContent(tk.Types.list_item_end, [], true).map(node => {
        if (typeof node === "string") {
          // Add space to prevent text strings from being joined together.
          return `${node} `;
        } else {
          if (node.type === ast.Types.space) {
            const newline: ast.NewLine = {
              type: ast.Types.newline,
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

    assertPopToken("ListItem", [tk.Types.list_item_end]);

    return {
      type: ast.Types.list_item,
      children,
      isBlock,
    };
  }


  function parseList(): ast.List {
    const { ordered } = <tk.ListStart> assertPopToken("List", [tk.Types.list_start]);

    let items: ast.Node[] = [];

    while (true) {
      let token = peekToken()

      if (token && token.type === tk.Types.list_item_start) {
        items.push(parseListItem());
      } else {
        break;
      }
    }

    assertPopToken("List", [tk.Types.list_end]);

    return {
      type: ast.Types.list,
      ordered,
      items
    };
  }

  function parseBlockQuote(): ast.BlockQuote {

    assertPopToken("BlockQuote", [tk.Types.blockquote_start]);
    let children = parseContent(tk.Types.blockquote_end);
    assertPopToken("BlockQuote", [tk.Types.blockquote_end]);

    return {
      type: "blockquote",
      children,
    };
  }

  function parseSection(): ast.Section {
    let token = peekToken();

    let id: string;

    let heading: ast.Heading;
    let content: ast.Node[] = [];

    if (token && token.type === tk.Types.heading) {
      let headingToken = <tk.Heading>token;
      heading = parseHeading();
      id = heading.id;
      content.push(heading);
    } else {
      id = "_top";
    }

    parseContent(ast.Types.heading, content);

    return {
      type: ast.Types.section,
      children: content,
      id,
    }
  }

  function parseHeading(): ast.Heading {
    let token = <tk.Heading>tokens.pop();
    let id = ensureUnique(token.text)

    return {
      id,
      type: ast.Types.heading,
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
    const { text } = <tk.HTML>tokens.pop();
    const [doc, _] = parseXMLHeredoc(text);
    const { tag, attrs, content } = doc;

    const node: ast.JSX = {
      type: "jsx",
      name: tag,
      attrs,
    }

    if (content) {
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

      const type = token.type;

      if (type == endType) {
        return content
      }

      // Get rid of space, except when it matters (in list items...)
      if (!preserveSpace && type == tk.Types.space) {
        popToken();
        continue;
      }

      if (token.type === tk.Types.list_start) {
        content.push(parseList());
      } else if (token.type === tk.Types.text) {
        popToken();
        let children = parseInline(token.text);
        content.push(...children);
      } else if (token.type === tk.Types.paragraph) {
        content.push(parseParagraph());
      } else if (token.type === tk.Types.heading) {
        content.push(parseHeading());
      } else if (token.type == tk.Types.blockquote_start) {
        content.push(parseBlockQuote());
      } else if (token.type === tk.Types.html) {
        const { text } = <tk.HTML>token;
        if (text.match(/^<[A-Z]/)) {
          // treat uppercase tags as components
          content.push(parseComponent());
        } else {
          // normal html node
          const tk = <tk.HTML>tokens.pop();

          const node: ast.HTML = {
            type: ast.Types.html,
            inline: false,
            pre: true,
            text: tk.text,
          };

          content.push(node);
        }

      } else {
        // Inline items here. We can use tokens as nodes.
        popToken();
        content.push(token as ast.Node);
      }
    }
  }

  while (tokens.length > 0) {
    sections.push(parseSection())
  }

  return sections;
}
