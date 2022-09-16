import { LauncherOption } from "../../common/launcher";
import { OptionsProvider } from "./options";
import { describe, expect, it, vi } from "vitest";
import { spyOnImplementing } from "vitest-mock-process";

vi.mock("xdg-basedir", () => ({
  xdgDataDirectories: ["/xdg-data-dir"],
}));

describe("Creating options to be displayed in the renderer", () => {
  it("should read options from stdin in dmenu mode", async () => {
    const mockStdin = {
      read: spyOnImplementing(process.stdin, "read", () => "arg1\narg2\narg3"),
      on: spyOnImplementing(process.stdin, "on", (event: string, cb) => cb()),
    };
    import.meta.env.PROD = true;
    process.argv = ["--mode dmenu"];

    const options = await OptionsProvider.getOptions();
    expect(options).toEqual([
      anOption({ id: "1", name: "arg1" }),
      anOption({ id: "2", name: "arg2" }),
      anOption({ id: "3", name: "arg3" }),
    ]);
    expect(mockStdin.read).toHaveBeenCalledTimes(1);
    expect(mockStdin.on).toHaveBeenCalledTimes(2);
  });

  it("should read desktop entries in apps mode", async () => {});
});

const anOption = (option: Partial<LauncherOption>) => ({
  id: "1",
  name: "test",
  ...option,
});
