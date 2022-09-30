import { desktopEntryContents } from "../../../common/tests/test-utils";
import {
  getDesktopEntries,
  getDesktopEntryPaths,
  parseDesktopEntry,
} from "./desktop-apps";
import fs from "fs";
import { afterEach, describe, expect, it, Mock, vi } from "vitest";

vi.mock("xdg-basedir", () => ({
  xdgDataDirectories: ["/xdg-data-dir", "/xdg-data-dir-2"],
}));

vi.mock("fs", () => ({
  default: {
    promises: {
      readdir: vi.fn(async () => [
        "file1.desktop",
        "file2.desktop",
        "unrelated.jpg",
      ]),
      readFile: vi.fn(),
    },
  },
}));

vi.mock("freedesktop-icons", () => ({
  default: vi.fn(async (path: string) => `/freedesktop/${path}`),
}));

describe("Handling desktop apps", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should find desktop apps", async () => {
    const apps = await getDesktopEntryPaths();
    expect(apps).toEqual([
      "/xdg-data-dir/applications/file1.desktop",
      "/xdg-data-dir/applications/file2.desktop",
      "/xdg-data-dir-2/applications/file1.desktop",
      "/xdg-data-dir-2/applications/file2.desktop",
    ]);
    expect(fs.promises.readdir).toHaveBeenCalledTimes(2);
  });

  it("should handle errors when reading a directory", async () => {
    (fs.promises.readdir as Mock).mockImplementation(async () => {
      throw new Error("Could not read directory");
    });
    const apps = await getDesktopEntryPaths();
    expect(apps).toEqual([]);
    expect(fs.promises.readdir).toHaveBeenCalledTimes(2);
  });

  it("should return a parsed list of desktop entries", async () => {
    (fs.promises.readdir as Mock).mockImplementation(async () => [
      "file1.desktop",
    ]);
    (fs.promises.readFile as Mock).mockImplementationOnce(async () =>
      desktopEntryContents("App Name", "App Comment", "app-icon", "app-exec")
    );
    (fs.promises.readFile as Mock).mockImplementationOnce(async () =>
      desktopEntryContents("Another App", "2nd Comment", "2nd-icon", "my-app")
    );

    const entries = await getDesktopEntries();
    expect(entries).toEqual([
      {
        entry: {
          "Desktop Entry": {
            Type: "Application",
            Version: "1.0",
            Name: "App Name",
            Comment: "App Comment",
            // Icon: "file:///freedesktop/app-icon",
            Icon: undefined,
            Exec: "app-exec",
          },
        },
        path: "/xdg-data-dir/applications/file1.desktop",
      },
      {
        entry: {
          "Desktop Entry": {
            Type: "Application",
            Version: "1.0",
            Name: "Another App",
            Comment: "2nd Comment",
            // Icon: "file:///freedesktop/2nd-icon",
            Icon: undefined,
            Exec: "my-app",
          },
        },
        path: "/xdg-data-dir-2/applications/file1.desktop",
      },
    ]);
  });

  it("should handle errors when reading a file", async () => {
    (fs.promises.readdir as Mock).mockImplementationOnce(async () => [
      "file1.desktop",
      "file2.desktop",
    ]);
    (fs.promises.readdir as Mock).mockImplementationOnce(async () => []);
    (fs.promises.readFile as Mock).mockImplementationOnce(async () => {
      return new Promise((_, reject) => {
        reject(new Error("Could not read file"));
      });
    });
    (fs.promises.readFile as Mock).mockImplementationOnce(async () =>
      desktopEntryContents("App Name", "App Comment", "app-icon", "app-exec")
    );

    const entries = await getDesktopEntries();
    expect(entries).toEqual([
      {
        entry: {
          "Desktop Entry": {
            Type: "Application",
            Version: "1.0",
            Name: "App Name",
            Comment: "App Comment",
            // Icon: "file:///freedesktop/app-icon",
            Icon: undefined,
            Exec: "app-exec",
          },
        },
        path: "/xdg-data-dir/applications/file2.desktop",
      },
    ]);
  });

  describe("parsing desktop entries", () => {
    it("can parse a basic .desktop file", async () => {
      const parsed = await parseDesktopEntry(
        desktopEntryContents("App Name", "App Comment", "app-icon", "app-exec")
      );
      expect(parsed).toEqual({
        "Desktop Entry": {
          Type: "Application",
          Version: "1.0",
          Name: "App Name",
          Comment: "App Comment",
          Icon: "app-icon",
          Exec: "app-exec",
        },
      });
    });

    it("handles parsing a line with more than one equals sign", async () => {
      const parsed = await parseDesktopEntry(`[Desktop Entry]
        key=value=value
      `);
      expect(parsed).toEqual({
        "Desktop Entry": {
          key: "value=value",
        },
      });
    });

    it("throws when parsing a .desktop file without a header", async () => {
      await expect(
        parseDesktopEntry(`
          Name=App Name
          Comment=App Comment
      `)
      ).rejects.toThrow();
    });

    it("throws when parsing a .desktop file with the first header being something else than [Desktop Entry]", async () => {
      await expect(
        parseDesktopEntry(`
          [Not Desktop Entry]
      `)
      ).rejects.toThrow();
    });

    it("throws when parsing a line with no equals sign", async () => {
      await expect(
        parseDesktopEntry(`
          [Desktop Entry]
          key
      `)
      ).rejects.toThrow();
    });

    it("throws when parsing a line with an empty key", async () => {
      await expect(
        parseDesktopEntry(`
          [Desktop Entry]
          =App Name
      `)
      ).rejects.toThrow();
    });
  });
});
