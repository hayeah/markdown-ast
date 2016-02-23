import { assert } from "chai";
import { parseXMLHeredoc, XMLHereDoc } from "./parseXMLHeredoc"

describe("parseXMLHeredoc", () => {
  let result: XMLHereDoc;

  describe("tag with content", () => {
    before(() => {
      const input = "<abc a='1' b=\"2\" c>content</abc>"
      result = parseXMLHeredoc(input);
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
  });

  describe("self-closing tag", () => {
    before(() => {
      const input = "<abc a='1' b=\"2\" c/>"
      result = parseXMLHeredoc(input);
    });

    it("has no content", () => {
      assert.isUndefined(result.content);
    });

  });
});

