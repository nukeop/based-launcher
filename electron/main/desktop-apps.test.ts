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

  it("can parse a basic .desktop file", async () => {
    (fs.promises.readFile as Mock).mockImplementation(async () =>
      desktopEntryContents("App Name", "App Comment", "app-icon", "app-exec")
    );

    const parsed = await parseDesktopEntry(
      "/xdg-data-dir/applications/file1.desktop"
    );
    expect(parsed).toEqual({
      Name: "App Name",
      Comment: "App Comment",
      Icon: "app-icon",
      Exec: "app-exec",
    });
    expect(fs.promises.readFile).toHaveBeenCalledWith(
      "/xdg-data-dir/applications/file1.desktop",
      "utf-8"
    );
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
        Name: "App Name",
        Comment: "App Comment",
        Icon: "app-icon",
        Exec: "app-exec",
      },
      {
        Name: "Another App",
        Comment: "2nd Comment",
        Icon: "2nd-icon",
        Exec: "my-app",
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
        Name: "App Name",
        Comment: "App Comment",
        Icon: "app-icon",
        Exec: "app-exec",
      },
    ]);
  });
});

const desktopEntryContents = (
  name: string,
  description: string,
  icon: string,
  exec: string
) => `# Comment
[Desktop Entry]
Name=${name}
Comment=${description}
Icon=${icon}
Exec=${exec}
Empty=
=invalid
`;
