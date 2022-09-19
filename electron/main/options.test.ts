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

describe("Creating options to be displayed in the renderer", () => {
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
    const mockStdin = {
      read: spyOnImplementing(process.stdin, "read", () => "arg1\narg2\narg3"),
      on: spyOnImplementing(process.stdin, "on", (event: string, cb) => cb()),
    };
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
    mockStdin.read.mockRestore();
    mockStdin.on.mockRestore();
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
          type: LauncherActionType.Execute,
          payload: "app-exec",
        },
      }),
      anOption({
        id: "2",
        name: "Another App",
        description: "2nd Comment",

        icon: "file:///freedesktop/2nd-icon",
        onAction: {
          type: LauncherActionType.Execute,
          payload: "my-app",
        },
      }),
    ]);
  });

  describe("input format", () => {
    it("should read and parse json data", async () => {
      const mockStdin = {
        read: spyOnImplementing(
          process.stdin,
          "read",
          () =>
            `[{"id": "1", "name": "arg1", "description": "my description", "icon": "my-icon", "onAction": {"type": "execute", "payload": "my-app"}}]`
        ),
        on: spyOnImplementing(process.stdin, "on", (event: string, cb) => cb()),
      };
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
      mockStdin.read.mockRestore();
      mockStdin.on.mockRestore();
    });

    it("should fill in missing attributes with default values", async () => {
      const mockStdin = {
        read: spyOnImplementing(
          process.stdin,
          "read",
          () => `[{"name": "arg1"}]`
        ),
        on: spyOnImplementing(process.stdin, "on", (event: string, cb) => cb()),
      };
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
      mockStdin.read.mockRestore();
      mockStdin.on.mockRestore();
    });
  });
});
