import { readPipedArgs } from "./args";
import { describe, expect, it, vi } from "vitest";
import { spyOnImplementing } from "vitest-mock-process";

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
  it("should read piped args", async () => {
    const mockStdin = {
      read: spyOnImplementing(process.stdin, "read", () => "arg1\narg2\narg3"),
      on: spyOnImplementing(
        process.stdin,
        "on",
        // @ts-ignore
        (event: string, cb) => {
          cb();
        }
      ),
    };

    const args = await readPipedArgs();
    expect(args).toEqual(["arg1", "arg2", "arg3"]);
    expect(mockStdin.read).toHaveBeenCalledTimes(1);
    expect(mockStdin.on).toHaveBeenCalledTimes(2);
    expect(mockStdin.on).toHaveBeenCalledWith("readable", expect.any(Function));
    expect(mockStdin.on).toHaveBeenCalledWith("end", expect.any(Function));
  });

  it("should read CLI args", async () => {
    process.argv = [
      "node",
      "electron/main/args.test.ts",
      "--arg1",
      "--arg2",
      "--arg3",
    ];

    const args = await readPipedArgs();
    expect(args).toEqual(["arg1", "arg2", "arg3"]);
  });
});
