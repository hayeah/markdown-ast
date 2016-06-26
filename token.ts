// The objects returned by marked lexer.

interface TypeNames {
  heading: "heading",
  list_start: "list_start",
  list_end: "list_end",

  paragraph: "paragraph",

  list_item_start: "list_item_start",
  loose_item_start: "loose_item_start",
  list_item_end: "list_item_end",

  blockquote_start: "blockquote_start",
  blockquote_end: "blockquote_end",

  html: "html",

  text: "text",
  space: "space",
}

export const Types: TypeNames = {
  heading: "heading",
  list_start: "list_start",
  list_end: "list_end",

  paragraph: "paragraph",

  list_item_start: "list_item_start",
  loose_item_start: "loose_item_start",
  list_item_end: "list_item_end",

  blockquote_start: "blockquote_start",
  blockquote_end: "blockquote_end",

  html: "html",

  text: "text",
  space: "space",
};

export type Token =
  Space |
  Text |
  Paragraph |
  Heading |
  HTML |
  ListStart |
  ListEnd |
  ListItemStart |
  ListLooseItemStart |
  ListItemEnd |
  BlockQuoteStart |
  BlockQuoteEnd
  ;

export interface Space {
  type: "space",
}

export interface Text {
  type: "text",
  text: string,
}

// export function isText(t: Token): t is Text {
//   return t.type === Types.text;
// }

export interface Paragraph {
  type: "paragraph",
  text: string,
}

export interface Heading {
  type: "heading",
  depth: number,
  text: string,
}

export interface HTML {
  type: "html",
  pre: boolean,
  text: string,
}

export interface BlockQuoteStart {
  type: "blockquote_start"
}

export interface BlockQuoteEnd {
  type: "blockquote_end"
}

export interface ListStart {
  type: "list_start"
  ordered: boolean,
}

export interface ListEnd {
  type: "list_end"
}

export interface ListItemStart {
  type: "list_item_start";
}

export interface ListItemEnd {
  type: "list_item_end";
}

export interface ListLooseItemStart {
  type: "loose_item_start";
}

// export function isListItemStartToken(token: Token): token is ListItemStartToken {
//   return token.type == Types.list_item_start || token.type == Types.loose_item_start;
// }
