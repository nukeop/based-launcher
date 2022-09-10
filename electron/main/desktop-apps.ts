import { xdgData, xdgDataDirectories } from "xdg-basedir";

export const getApps = async () => {
  console.log({
    xdgDataDirectories,
  });
};
