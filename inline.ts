const marked = require("marked");

import * as ast from "./Ast";

let options = Object.assign(marked.defaults,{xhtml: true});
let inlineLexer = new marked.InlineLexer([],options);

inlineLexer.outputAST = outputAST;

type InlineItem = ast.Node | string;

export function parseInline(src: string): InlineItem[] {
  return inlineLexer.outputAST(src);
}

function outputAST(src: string): InlineItem[] {
  var items: InlineItem[] = [];

  var out: string = '';
  var link
    , text
    , href
    , cap;

  function pushTextItem() {
    items.push(out);
    out = "";
  }

  function pushNode(node: ast.Node) {
    pushTextItem();
    items.push(node);
  }

  while (src) {
    // escape
    if (cap = this.rules.escape.exec(src)) {
      src = src.substring(cap[0].length);
      out += cap[1];
      continue;
    }

    // autolink
    // if (cap = this.rules.autolink.exec(src)) {
    //   src = src.substring(cap[0].length);
    //   if (cap[2] === '@') {
    //     text = cap[1].charAt(6) === ':'
    //       ? this.mangle(cap[1].substring(7))
    //       : this.mangle(cap[1]);
    //     href = this.mangle('mailto:') + text;
    //   } else {
    //     text = escape(cap[1]);
    //     href = text;
    //   }
    //   out += this.renderer.link(href, null, text);
    //   continue;
    // }

    // // url (gfm)
    // if (!this.inLink && (cap = this.rules.url.exec(src))) {
    //   src = src.substring(cap[0].length);
    //   text = escape(cap[1]);
    //   href = text;
    //   out += this.renderer.link(href, null, text);
    //   continue;
    // }

    // // tag
    // if (cap = this.rules.tag.exec(src)) {
    //   if (!this.inLink && /^<a /i.test(cap[0])) {
    //     this.inLink = true;
    //   } else if (this.inLink && /^<\/a>/i.test(cap[0])) {
    //     this.inLink = false;
    //   }
    //   src = src.substring(cap[0].length);
    //   out += this.options.sanitize
    //     ? this.options.sanitizer
    //       ? this.options.sanitizer(cap[0])
    //       : escape(cap[0])
    //     : cap[0]
    //   continue;
    // }

    if (cap = this.rules.tag.exec(src)) {
      // We sort of use html as heredoc.
      // Search for closing tag. keep everything in between as is

      // if (!this.inLink && /^<a /i.test(cap[0])) {
      //   this.inLink = true;
      // } else if (this.inLink && /^<\/a>/i.test(cap[0])) {
      //   this.inLink = false;
      // }
      src = src.substring(cap[0].length);
      // out += this.options.sanitize
      //   ? this.options.sanitizer
      //     ? this.options.sanitizer(cap[0])
      //     : escape(cap[0])
      //   : cap[0]
      console.log("tag",cap);

      continue;
    }


    // // link
    // if (cap = this.rules.link.exec(src)) {
    //   src = src.substring(cap[0].length);
    //   this.inLink = true;
    //   out += this.outputLink(cap, {
    //     href: cap[2],
    //     title: cap[3]
    //   });
    //   this.inLink = false;
    //   continue;
    // }

    // // link
    if (cap = this.rules.link.exec(src)) {
      src = src.substring(cap[0].length);

      const [_, caption, href, title] = cap;

      if(cap[0].charAt(0) === "!") {
        let node: ast.Image = {
          type: "image",
          caption,
          href,
          title,
        }

        pushNode(node);

      } else {
        let node: ast.Link = {
          type: "link",
          caption,
          href,
          title,
        }

        pushNode(node);
      }

      continue;
    }

    // // reflink, nolink
    // if ((cap = this.rules.reflink.exec(src))
    //     || (cap = this.rules.nolink.exec(src))) {
    //   src = src.substring(cap[0].length);
    //   link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
    //   link = this.links[link.toLowerCase()];
    //   if (!link || !link.href) {
    //     out += cap[0].charAt(0);
    //     src = cap[0].substring(1) + src;
    //     continue;
    //   }
    //   this.inLink = true;
    //   out += this.outputLink(cap, link);
    //   this.inLink = false;
    //   continue;
    // }

    // // strong
    // if (cap = this.rules.strong.exec(src)) {
    //   src = src.substring(cap[0].length);
    //   out += this.renderer.strong(this.output(cap[2] || cap[1]));
    //   continue;
    // }

    // strong
    if (cap = this.rules.strong.exec(src)) {
      src = src.substring(cap[0].length);

      let node: ast.Strong = {
        type: "strong",
        text: cap[2] || cap[1],
      };

      pushNode(node);

      continue;
    }

    // // em
    // if (cap = this.rules.em.exec(src)) {
    //   src = src.substring(cap[0].length);
    //   out += this.renderer.em(this.output(cap[2] || cap[1]));
    //   continue;
    // }

    if (cap = this.rules.em.exec(src)) {
      src = src.substring(cap[0].length);

      let node: ast.Emphasis = {
        type: "emphasis",
        text: cap[2] || cap[1],
      }

      pushNode(node);

      continue;
    }

    // code
    // if (cap = this.rules.code.exec(src)) {
    //   src = src.substring(cap[0].length);
    //   out += this.renderer.codespan(escape(cap[2], true));
    //   continue;
    // }

    // code
    if (cap = this.rules.code.exec(src)) {
      src = src.substring(cap[0].length);

      let node: ast.InlineCode = {
        type: "inline-code",
        text: cap[2],
      }

      pushNode(node)

      continue;
    }

    // // br
    // if (cap = this.rules.br.exec(src)) {
    //   src = src.substring(cap[0].length);
    //   out += this.renderer.br();
    //   continue;
    // }

    // // del (gfm)
    // if (cap = this.rules.del.exec(src)) {
    //   src = src.substring(cap[0].length);
    //   out += this.renderer.del(this.output(cap[1]));
    //   continue;
    // }

    // Accmulate into string.
    if (cap = this.rules.text.exec(src)) {
      src = src.substring(cap[0].length);
      // out += this.renderer.text(escape(this.smartypants(cap[0])));
      out += cap[0];
      continue;
    }

    if (src) {
      throw new
        Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  if(out != "") {
    pushTextItem();
  }

  return items;

  // return out;
};


function escape(html, encode) {
  return html
    .replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
