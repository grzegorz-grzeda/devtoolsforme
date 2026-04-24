import { describe, expect, it } from "vitest";

import { filterHTTPStatuses, statusMap } from "../../lib/http-status";

describe("http status lookup data", () => {
  it("covers the standard HTTP status codes supported by the tool", () => {
    expect(Object.keys(statusMap)).toEqual([
      "100", "101", "102", "103",
      "200", "201", "202", "203", "204", "205", "206", "207", "208", "226",
      "300", "301", "302", "303", "304", "305", "307", "308",
      "400", "401", "402", "403", "404", "405", "406", "407", "408", "409", "410", "411", "412", "413", "414", "415", "416", "417", "418", "421", "422", "423", "424", "425", "426", "428", "429", "431", "451",
      "500", "501", "502", "503", "504", "505", "506", "507", "508", "510", "511"
    ]);
  });

  it("includes practical examples and mitigation guidance for each entry", () => {
    for (const info of Object.values(statusMap)) {
      expect(info.examples.length).toBeGreaterThan(0);
      expect(info.mitigation.length).toBeGreaterThan(0);
    }
  });

  it("supports scenario-based search terms from the richer guidance text", () => {
    expect(filterHTTPStatuses("websocket").map(([code]) => code)).toContain("101");
    expect(filterHTTPStatuses("captive portal").map(([code]) => code)).toEqual(["511"]);
    expect(filterHTTPStatuses("court order").map(([code]) => code)).toEqual(["451"]);
  });
});
