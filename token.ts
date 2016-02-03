// The objects returned by marked lexer.

export const Types = {
  heading: "heading",
  list_start: "list_start",
  list_end: "list_end",

  paragraph: "paragraph",

  list_item_start: "list_item_start",
  loose_item_start: "loose_item_start",
  list_item_end: "list_item_end",

  blockquote_start: "blockquote_start",
  blockquote_end: "blockquote_end",
};

export interface Token {
  type: string,
}

export interface Paragraph extends Token {
  type: "paragraph",
  text: string,
}

export interface Heading extends Token {
  type: "heading",
  depth: number,
  text: string,
}

export interface ListStart extends Token {
  type: "list_start"
  ordered: boolean,
}

export function isListStartToken(token: Token): token is ListStart {
  return token.type == Types.list_start;
}

export interface ListItemStartToken extends Token {
  type: "list_item_start" | "loose_item_start",
}

export function isListItemStartToken(token: Token): token is ListItemStartToken {
  return token.type == Types.list_item_start || token.type == Types.loose_item_start;
}
