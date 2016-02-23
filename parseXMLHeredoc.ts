// Adapted from http://erik.eae.net/simplehtmlparser/simplehtmlparser.js
// Also see: http://ejohn.org/blog/pure-javascript-html-parser/

const startTag = /^<([-A-Za-z0-9_]+)((?:\s+\w+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/;
const endTag = /^<\/([-A-Za-z0-9_]+)[^>]*>/;
const attrRE = /([-A-Za-z0-9_]+)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g;

// console.log("<abc>".match(startTag));
// console.log("<abc a='1' b='2' c d>".match(startTag));
// console.log(parseXMLHeredoc("<abc a='1' b='2' c d>blah blah blah </abc>"));
// console.log(parseXMLHeredoc("<abc a='1' b='2'/>"));

type Attributes = { [key: string]: any };

export interface XMLHereDoc {
  tag: string;
  attrs: Attributes;
  content?: string;
}

export function parseXMLHeredoc(input: string): XMLHereDoc {
	const matches = input.match(startTag);
  if(!matches) {
    return;
  }

  // console.log(matches);

	const tagName = matches[1];
	const tagAttributesString = matches[2];
  const isSelfClosing = matches[3] === '/';

  let content: string;
  if(!isSelfClosing) {
    const closeTag = `</${tagName}>`;

    const end = input.lastIndexOf(closeTag);

    content = input.slice(matches[0].length, end);
  }

	const attrs = parseAttributes(tagAttributesString);

	return {
		tag: tagName,
		attrs,
    content,
	}
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

// console.log(parseAttributes("a='1' b=\"2\" c data-foo='blahblah'"))





