import Logger from "./logger";
import fs from "fs";
import { xdgDataDirectories } from "xdg-basedir";

export const getDesktopEntryPaths = async () => {
  const applicationDirs = xdgDataDirectories.map(
    (dir) => `${dir}/applications`
  );
  const desktopEntriesByDir = await Promise.all(
    applicationDirs.map(async (dir) => {
      try {
        const files = await fs.promises.readdir(dir);
        return files
          .filter((file) => file.endsWith(".desktop"))
          .map((file) => `${dir}/${file}`);
      } catch (e) {
        Logger.error(`Could not read directory ${dir}`, e);
        return [];
      }
    })
  );

  return desktopEntriesByDir.flat();
};

export const parseDesktopEntry = async (path: string) => {
  try {
    const content = await fs.promises.readFile(path, "utf-8");
    const lines = content.split("\n");
    return lines.reduce((acc, line) => {
      if (line.startsWith("#") || line.startsWith("[") || !line.includes("=")) {
        return acc;
      }
      const [key, value] = line.split("=");
      if (key && value) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, string>);
  } catch (e) {
    Logger.error(`Could not read file ${path}`, e);
    return;
  }
};

export const getDesktopEntries = async () => {
  const paths = await getDesktopEntryPaths();
  return (await Promise.all(paths.map(parseDesktopEntry))).filter(Boolean);
};
