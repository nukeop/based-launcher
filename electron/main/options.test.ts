import { LauncherActionType } from "../../common/launcher";
import {
  anOption,
  desktopEntryContents,
  givenArgv,
} from "../../common/tests/test-utils";
import { ArgsProvider } from "./args";
import { OptionsProvider } from "./options";
import fs from "fs";
import { describe, expect, it, Mock, vi, afterEach, beforeEach } from "vitest";
import { spyOnImplementing } from "vitest-mock-process";

vi.mock("xdg-basedir", () => ({
  xdgDataDirectories: ["/xdg-data-dir"],
}));

vi.mock("fs", () => ({
  default: {
    promises: {
      readdir: vi.fn(async () => ["file1.desktop", "file2.desktop"]),
      readFile: vi.fn(),
    },
  },
}));

vi.mock("freedesktop-icons", () => ({
  default: vi.fn(async (path: string) => `/freedesktop/${path}`),
}));

vi.mock("../../native/index.node", () => ({
  default: {
    getDesktopApps: () => [
      {
        name: "App Name",
        description: "App Comment",
        icon: "/freedesktop/app-icon",
        onAction: undefined,
        path: "/path/file1.desktop",
      },
      {
        name: "Another App",
        description: "2nd Comment",
        icon: "/freedesktop/2nd-icon",
        onAction: undefined,
        path: "/path/file2.desktop",
      },
    ],
  },
}));

describe("Creating options to be displayed in the renderer", () => {
  const mockStdin = {
    read: spyOnImplementing(process.stdin, "read", vi.fn()),
    on: spyOnImplementing(process.stdin, "on", (event: string, cb) => cb()),
  };

  beforeEach(() => {
    import.meta.env.PROD = true;
  });

  afterEach(() => {
    vi.clearAllMocks();
    OptionsProvider.isDone = false;
    ArgsProvider.isReadingStdinDone = false;
    ArgsProvider.isReadingFlagsDone = false;
  });

  it("should read options from stdin in dmenu mode", async () => {
    mockStdin.read.mockImplementation(() => "arg1\narg2\narg3");
    givenArgv("--mode=dmenu");

    const options = await OptionsProvider.getOptions();
    expect(options).toEqual([
      anOption({
        id: "1",
        name: "arg1",
        onAction: {
          type: LauncherActionType.Return,
          payload: "arg1",
        },
      }),
      anOption({
        id: "2",
        name: "arg2",
        onAction: {
          type: LauncherActionType.Return,
          payload: "arg2",
        },
      }),
      anOption({
        id: "3",
        name: "arg3",
        onAction: {
          type: LauncherActionType.Return,
          payload: "arg3",
        },
      }),
    ]);
    expect(mockStdin.read).toHaveBeenCalledTimes(1);
    expect(mockStdin.on).toHaveBeenCalledTimes(2);
  });

  it("should read desktop entries in apps mode", async () => {
    givenArgv("--mode=apps");
    (fs.promises.readFile as Mock).mockImplementationOnce(async () =>
      desktopEntryContents("App Name", "App Comment", "app-icon", "app-exec")
    );
    (fs.promises.readFile as Mock).mockImplementationOnce(async () =>
      desktopEntryContents("Another App", "2nd Comment", "2nd-icon", "my-app")
    );

    const options = await OptionsProvider.getOptions();
    expect(options).toEqual([
      anOption({
        id: "1",
        name: "App Name",
        description: "App Comment",
        icon: "file:///freedesktop/app-icon",
        onAction: {
          type: LauncherActionType.RunDesktopFile,
          payload: "file1.desktop",
        },
      }),
      anOption({
        id: "2",
        name: "Another App",
        description: "2nd Comment",
        icon: "file:///freedesktop/2nd-icon",
        onAction: {
          type: LauncherActionType.RunDesktopFile,
          payload: "file2.desktop",
        },
      }),
    ]);
  });

  describe("input format", () => {
    it("should read and parse json data", async () => {
      mockStdin.read.mockImplementation(
        () =>
          `[{"id": "1", "name": "arg1", "description": "my description", "icon": "my-icon", "onAction": {"type": "execute", "payload": "my-app"}}]`
      );

      givenArgv("--mode=dmenu", "--input-format=application/json");

      const options = await OptionsProvider.getOptions();
      expect(options).toEqual([
        anOption({
          id: "1",
          name: "arg1",
          description: "my description",
          icon: "my-icon",
          onAction: {
            type: LauncherActionType.Execute,
            payload: "my-app",
          },
        }),
      ]);
    });

    it("should fill in missing attributes with default values", async () => {
      mockStdin.read.mockImplementation(() => `[{"name": "arg1"}]`);
      givenArgv("--mode=dmenu", "--input-format=application/json");

      const options = await OptionsProvider.getOptions();
      expect(options).toEqual([
        anOption({
          id: "1",
          name: "arg1",
          onAction: {
            type: LauncherActionType.Return,
            payload: "arg1",
          },
        }),
      ]);
    });

    it('should throw if any items are missing the "name" attribute', async () => {
      mockStdin.read.mockImplementation(() => `[{"id": "1"}]`);
      givenArgv("--mode=dmenu", "--input-format=application/json");

      await expect(OptionsProvider.getOptions()).rejects.toThrow(
        "Name is required"
      );
    });
  });
});
