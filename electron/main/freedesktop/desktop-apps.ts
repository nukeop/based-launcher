import {
  DesktopEntry,
  DESKTOP_ENTRY_HEADER,
} from "../../../common/desktop-entries";
import rustModules from "../../../native/index.node";
import { ArgsProvider } from "../args";
import Logger from "../logger";
import fs from "fs";
import path from "path";
import { xdgDataDirectories } from "xdg-basedir";

export type DesktopEntryWithPath = {
  path: string;
  entry: DesktopEntry;
};
export class DesktopEntriesProvider {
  static desktopEntries: RustDesktopEntry[] = [];
  static isDone = false;

  private constructor() {}
}

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
): Promise<DesktopEntryWithPath | undefined> => {
  try {
    const contents = await fs.promises.readFile(path, "utf-8");
    const entry = await parseDesktopEntry(contents);

    // const icon = await freedesktopIcons(entry[DESKTOP_ENTRY_HEADER].Icon);
    return {
      path,
      entry: {
        [DESKTOP_ENTRY_HEADER]: {
          ...entry[DESKTOP_ENTRY_HEADER],
          // Icon: icon && `file://${icon}`,
          Icon: undefined,
        },
      },
    };
  } catch (e) {
    Logger.warn(`Could not read file ${path}`, e);
    return undefined;
  }
};

export const parseDesktopEntry = async (
  contents: string
): Promise<DesktopEntry> => {
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
      if (tokens.length < 2) {
        throw new Error(`Invalid line`);
      }

      const key = tokens[0].trim();
      const value = tokens.slice(1).join("=").trim();

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
  }, {} as DesktopEntry);
};

export const getDesktopEntries = async (): Promise<DesktopEntryWithPath[]> => {
  const paths = await getDesktopEntryPaths();
  return (await Promise.all(paths.map(getDesktopEntryFromPath))).filter(
    Boolean
  ) as DesktopEntryWithPath[];
};

export const readDesktopEntries = async () => {
  Logger.debug("Reading desktop entries...");
  const startTime = process.hrtime();

  if (!DesktopEntriesProvider.isDone && ArgsProvider.flags.mode === "apps") {
    DesktopEntriesProvider.desktopEntries = rustModules.getDesktopApps(
      process.platform
    );
    DesktopEntriesProvider.isDone = true;
  }

  const endTime = process.hrtime(startTime);
  Logger.debug(
    `Read desktop entries in ${(
      endTime[0] * 1000 +
      endTime[1] / 1000000
    ).toFixed(0)}ms`
  );

  return DesktopEntriesProvider.desktopEntries;
};
