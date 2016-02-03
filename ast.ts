// Abstract Sytnax Tree for Markdown Document

export interface Node {
  type: string,
}

export const NodeTypes = {
  document: "document",
  heading: "heading",
  section: "section",
  list: "list",
  list_item: "list-item",
  paragraph: "paragraph",
  code: "code",
  html: "html",
  i18n: "i18n",
  blockquote: "blockquote",
}

export type InlineItem = Node | string;
export type Children = InlineItem[];

export interface TextNode extends Node {
  text: string,
}

export interface ContentNode extends Node {
  children: Children,
}

export interface IdNode extends Node {
  id: string,
}

export function isIdNode(o: any): o is IdNode {
  return o.id != null;
}

export function isTextNode(o: any): o is TextNode {
  return o.text != null;
}

export interface Paragraph extends ContentNode {
  type: "paragraph",
};

export type KeyNode = TextNode | IdNode;

export interface Heading extends TextNode {
  // a unique ID for the whole markdown document
  id: string,
  depth: number,
}

export interface Link extends Node {
  type: "link",
  caption: string,
  href: string,
  title: string,
}

export interface Image extends Node {
  type: "image",
  caption: string,
  href: string,
  title: string,
}

export interface InlineCode extends TextNode {
  type: "inline-code",
}

export interface Strong extends TextNode {
  type: "strong",
}

export interface Emphasis extends TextNode {
  type: "emphasis",
}


export interface Code extends TextNode {
  lang: string,
}

export interface HTML extends TextNode {
  pre: boolean,
}

export interface List extends Node {
  ordered: boolean,
  items: Node[],
}

export interface ListItem extends ContentNode {
}

export function isListItem(o: Node): o is ListItem {
  return o.type == NodeTypes.list_item;
}

export function isList(o: Node): o is List {
  return o.type == NodeTypes.list;
}

export interface Section extends ContentNode {
  id: string,
}

export interface Document extends Node {
  type: "document",
  children: Section[],
}

// export type Document = Section[];

// export interface i18n extends Node {
//   id: string,
//   lang: string,
//   sections: Section[],
// }

export interface BlockQuote extends ContentNode {
  type: "blockquote",
}