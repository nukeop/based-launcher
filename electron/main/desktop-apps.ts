import Logger from "./logger";
import fs from "fs";
import path from "path";
import { xdgDataDirectories } from "xdg-basedir";

const DESKTOP_ENTRY_HEADER = "Desktop Entry";

export type DesktopEntryContents = {
  [DESKTOP_ENTRY_HEADER]: Record<string, string>;
  [key: string]: Record<string, string>;
};

export const getDesktopEntryPaths = async () => {
  const applicationDirs = xdgDataDirectories.map((dir) =>
    path.join(dir, "applications")
  );
  const desktopEntriesByDir = await Promise.all(
    applicationDirs.map(async (dir) => {
      try {
        const files = await fs.promises.readdir(dir);
        return files
          .filter((file) => file.endsWith(".desktop"))
          .map((file) => `${dir}/${file}`);
      } catch (e) {
        Logger.warn(`Could not read directory ${dir}`, e);
        return [];
      }
    })
  );

  return desktopEntriesByDir.flat();
};

export const getDesktopEntryFromPath = async (
  path: string
): Promise<DesktopEntryContents | undefined> => {
  try {
    const contents = await fs.promises.readFile(path, "utf-8");
    return await parseDesktopEntry(contents);
  } catch (e) {
    Logger.warn(`Could not read file ${path}`, e);
    return undefined;
  }
};

export const parseDesktopEntry = async (
  contents: string
): Promise<DesktopEntryContents> => {
  const lines = contents.split("\n");
  let currentHeader: string | undefined = undefined;

  return lines.reduce((acc, line) => {
    if (line.startsWith("#") || line.trim().length === 0) {
      return acc;
    }

    if (line.startsWith("[") && line.endsWith("]")) {
      const header = line.substring(1, line.length - 1);
      if (!currentHeader && header !== DESKTOP_ENTRY_HEADER) {
        throw new Error(
          `First header in .desktop file must be [${DESKTOP_ENTRY_HEADER}]`
        );
      } else {
        currentHeader = header;
        acc[currentHeader] = {};
      }
    } else if (currentHeader) {
      if (!acc[currentHeader]) {
        throw new Error(
          `File must not contain entries before the [${DESKTOP_ENTRY_HEADER}] header`
        );
      }

      const tokens = line.split("=");
      if (tokens.length !== 2) {
        throw new Error(`Invalid line`);
      }

      const key = tokens[0].trim();
      const value = tokens[1].trim();

      if (key.length === 0) {
        throw new Error(`Missing key`);
      }
      acc[currentHeader][key] = value;
    } else {
      throw new Error(
        `File must not contain entries before the [${DESKTOP_ENTRY_HEADER}] header`
      );
    }

    return acc;
  }, {} as DesktopEntryContents);
};

export const getDesktopEntries = async (): Promise<DesktopEntryContents[]> => {
  const paths = await getDesktopEntryPaths();
  return (await Promise.all(paths.map(getDesktopEntryFromPath))).filter(
    Boolean
  ) as DesktopEntryContents[];
};
