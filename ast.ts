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
  jsx: "jsx",
  i18n: "i18n",
  blockquote: "blockquote",
  newline: "newline",
}

export type InlineItem = Node | string;
export type Children = InlineItem[];

export interface NewLine extends Node {
  type: "newline";
}

export interface TextNode extends Node {
  text: string,
}

export interface ContentNode extends Node {
  children: Children,
}

export function isContentNode(o: any): o is ContentNode {
  return o.children != null;
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

export function isHeading(o: any): o is Heading {
  return o.type === NodeTypes.heading;
}


export interface Link extends Node {
  type: "link",
  caption: string,
  href: string,
  title?: string,
}

export interface Image extends Node {
  type: "image",
  caption: string,
  href: string,
  title?: string,
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
  inline: boolean,
  pre: boolean,
}

export interface JSX extends Node {
  type: "jsx";
  name: string;
  attrs: { [key: string]: string | boolean };
  sections?: Section[];
}

export interface List extends Node {
  ordered: boolean,
  items: Node[],
}

export interface ListItem extends ContentNode {
  isBlock: boolean;
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