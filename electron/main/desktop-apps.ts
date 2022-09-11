import fs from "fs";
import { xdgDataDirectories } from "xdg-basedir";

export const getApps = async () => {
  const applicationDirs = xdgDataDirectories.map(
    (dir) => `${dir}/applications`
  );
  return Promise.all(
    applicationDirs.map(async (dir) => {
      if (!fs.existsSync(dir)) {
        return [];
      }

      const files = await fs.promises.readdir(dir);
      return files
        .filter((file) => file.endsWith(".desktop"))
        .map((file) => `${dir}/${file}`);
    })
  );
};

export const parseDesktopFile = async (path: string) => {
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
};

export const optionsFromApps = (apps: Record<string, string>[]) => {
  return apps.map((app) => ({
    id: app.Name,
    name: app.Name,
    description: app.Comment,
    icon: app.Icon,
  }));
};
