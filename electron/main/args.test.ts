import { readCLIFlags } from "./args";
import { givenArgv } from "common/tests/test-utils";
import { describe, expect, it, vi } from "vitest";

vi.mock("process", () => ({
  default: {
    stdin: {
      isTTY: false,
      setEncoding: vi.fn(),
      on: vi.fn(),
      read: vi.fn(),
    },
    hrtime: vi.fn(),
  },
}));

vi.mock("./config.ts", () => ({
  readConfig: vi.fn(),
}));

describe("Handling program arguments", () => {
  it("should read CLI args", async () => {
    import.meta.env.PROD = true;
    givenArgv("--theme=test.css", "--input-prefix=test-prefix");

    const args = await readCLIFlags();
    expect(args).toEqual(
      expect.objectContaining({
        theme: "test.css",
        inputPrefix: "test-prefix",
      })
    );
  });
});
