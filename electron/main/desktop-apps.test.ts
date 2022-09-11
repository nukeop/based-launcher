import { getApps, parseDesktopFile } from "./desktop-apps";
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
    const apps = await getApps();
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
    const apps = await getApps();
    expect(apps).toEqual([]);
    expect(fs.promises.readdir).toHaveBeenCalledTimes(2);
  });

  it("can parse a basic .desktop file", async () => {
    const content = `# Comment
[Desktop Entry]
Name=App Name
Comment=App Comment
Icon=app-icon
Exec=app-exec
`;
    (fs.promises.readFile as Mock).mockImplementation(async () => content);

    const parsed = await parseDesktopFile(
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
});
