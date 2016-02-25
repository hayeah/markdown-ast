// Adapted from http://erik.eae.net/simplehtmlparser/simplehtmlparser.js
// Also see: http://ejohn.org/blog/pure-javascript-html-parser/

export const startTagRE = /^<([-A-Za-z0-9_]+)((?:\s+\w+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/;
const endTagRE = /^<\/([-A-Za-z0-9_]+)[^>]*>/;
const attrRE = /([-A-Za-z0-9_]+)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g;

type Attributes = { [key: string]: any };

export interface XMLHereDoc {
  tag: string;
  attrs: Attributes;
  content?: string;
	raw: string;
}

export interface StartTag {
	tag: string;
	attrs: Attributes;
	isSelfClosing: boolean;

}

export function parseXMLHeredoc(input: string): [XMLHereDoc, string] {
	let raw: string;

	let remainder = "";
	const matches = input.match(startTagRE);
  if(!matches) {
    return;
  }


	raw = matches[0];
  // console.log(matches);

	const tagName = matches[1];
	const tagAttributesString = matches[2] || "";
  const isSelfClosing = matches[3] === '/';

  let content: string;
  if(!isSelfClosing) {
    const closeTag = `</${tagName}>`;

    const end = input.lastIndexOf(closeTag);

    content = input.slice(matches[0].length, end);

		raw += content + closeTag;

		remainder = input.substring(end + closeTag.length);
  } else {
		remainder = input.substring(matches[0].length);
	}

	const attrs = parseAttributes(tagAttributesString);

	const xml: XMLHereDoc = {
		tag: tagName,
		attrs,
    content,
		raw,
	};

	return [xml, remainder]
}

function parseAttributes(input: string): Attributes {
	const attrs = {};

	input.replace(attrRE, function (a0, a1, a2, a3) {
		const key = a1;
		let value = a2 || a3 || true;
		attrs[key] = value;

		return "";
	});

	return attrs;
}
