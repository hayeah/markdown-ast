// Abstract Sytnax Tree for Markdown Document

interface Types {
  document: "document",
  heading: "heading",
  section: "section",
  list: "list",
  list_item: "list-item",
  paragraph: "paragraph",
  code: "code",
  html: "html",
  jsx: "jsx",
  i18n: "i18n",
  blockquote: "blockquote",
  newline: "newline",
  space: "space",
}

// A hack to get string enums in TypeScript...
export const NodeTypes: Types = {
  document: "document",
  heading: "heading",
  section: "section",
  list: "list",
  list_item: "list-item",
  paragraph: "paragraph",
  code: "code",
  html: "html",
  jsx: "jsx",
  i18n: "i18n",
  blockquote: "blockquote",
  newline: "newline",
  space: "space",
}

export type InlineItem = Node | string;
export type Children = InlineItem[];

// Use the discriminant property `type` to narrow.
export type Node =
  NewLine |
  Space |
  List |
  ListItem |
  Paragraph |
  Heading |
  BlockQuote |
  JSX |
  HTML
  ;

export interface NewLine {
  type: "newline";
}

export interface Space {
  type: "space";
}

// export interface TextNode {
//   text: string,
// }

// export interface ContentNode {
//   children: Children,
// }

// export function isContentNode(o: any): o is ContentNode {
//   return o.children != null;
// }

// export interface IdNode {
//   id: string,
// }

// export function isIdNode(o: any): o is IdNode {
//   return o.id != null;
// }

// export function isTextNode(o: any): o is TextNode {
//   return o.text != null;
// }

export interface Paragraph {
  type: "paragraph",
  children: Children,
};

// export type KeyNode = TextNode | IdNode;

export interface Heading {
  // a unique ID for the whole markdown document
  type: "heading",
  id: string,
  depth: number,
  text: string;
}

export interface Link {
  type: "link",
  caption: string,
  href: string,
  title?: string,
}

export interface Image {
  type: "image",
  caption: string,
  href: string,
  title?: string,
}

export interface InlineCode {
  type: "inline-code",
  text: string;
}

export interface Strong {
  type: "strong",
  text: string;
}

export interface Emphasis {
  type: "emphasis",
  text: string;
}

export interface Code {
  type: "code",
  lang: string,
  text: string;
}

export interface HTML {
  type: "html",
  inline: boolean,
  pre: boolean,
  text: string;
}

export interface JSX {
  type: "jsx";
  name: string;
  attrs: { [key: string]: string | boolean };
  sections?: Section[];
}

export interface List {
  type: "list",
  ordered: boolean,
  items: Node[],
}

export interface ListItem {
  type: "list-item";
  children: Children;
  isBlock: boolean;
}

// export function isListItem(o: Node): o is ListItem {
//   return o.type == NodeTypes.list_item;
// }

// export function isList(o: Node): o is List {
//   return o.type == NodeTypes.list;
// }

export interface Section {
  type: "section";
  id: string;
  children: Children;
}

export interface Document {
  type: "document",
  children: Section[],
}

export interface BlockQuote {
  type: "blockquote";
  children: Children;
}