import { readCLIFlags } from "./args";
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

describe("Handling program arguments", () => {
  it("should read CLI args", async () => {
    import.meta.env.PROD = true;
    process.argv = [
      "node",
      "electron/main/args.test.ts",
      "--theme test.css",
      "--input-prefix test-prefix",
    ];

    const args = await readCLIFlags();
    expect(args).toEqual(
      expect.objectContaining({
        theme: "test.css",
        inputPrefix: "test-prefix",
      })
    );
  });
});
