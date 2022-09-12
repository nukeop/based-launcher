import { readPipedArgs } from "./args";
import { describe, expect, it } from "vitest";
import { spyOnImplementing } from "vitest-mock-process";

describe("Handling input data", () => {
  it("should read plaintext data from stdin", async () => {
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
});
