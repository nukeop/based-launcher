import { CLIFlags } from "../../common/cliFlags";
import Store from "electron-store";

export const readConfig = (): CLIFlags => {
  const store = new Store();

  return store.get("config") as CLIFlags;
};
