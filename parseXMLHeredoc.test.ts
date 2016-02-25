import { assert } from "chai";
import { parseXMLHeredoc, XMLHereDoc } from "./parseXMLHeredoc"

describe("parseXMLHeredoc", () => {
  let result: XMLHereDoc;
  let remainder: string;

  describe("tag with content", () => {
    before(() => {
      const input = "<abc a='1' b=\"2\" c>content</abc>abcd";
      [result, remainder] = parseXMLHeredoc(input);
    });

    it("parses tag name", () => {
      assert.equal(result.tag, "abc");
    });

    it("parses attributes", () => {
      assert.deepEqual(result.attrs, {
        a: "1",
        b: "2",
        c: true,
      });
    });

    it("parses content", () => {
      assert.deepEqual(result.content, "content");
    });

    it("returns raw html", () => {
      assert.equal(result.raw, "<abc a='1' b=\"2\" c>content</abc>");
    });

    it("returns unparsed remainder", () => {
      assert.equal(remainder, "abcd");
    });
  });

  describe("self-closing tag", () => {
    before(() => {
      const input = "<abc a='1' b=\"2\" c/>";
      [result, remainder] = parseXMLHeredoc(input);
    });

    it("has no content", () => {
      assert.isUndefined(result.content);
    });

    it("returns raw html", () => {
      assert.equal(result.raw, "<abc a='1' b=\"2\" c/>");
    });

  });

  describe("self-closing tag with no attrbiutes", () => {
    before(() => {
      const input = "<abc/>abcd";
      [result, remainder] = parseXMLHeredoc(input);
    });

    it("is empty", () => {
      assert.isUndefined(result.content);
      assert.deepEqual(result.attrs, {});
    });

    it("returns raw html", () => {
      assert.equal(result.raw, "<abc/>");
    });

    it("returns unparsed remainder", () => {
      assert.equal(remainder, "abcd");
    });
  });


});

