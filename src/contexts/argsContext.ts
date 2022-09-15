import { CLIFlags } from "../../common/cliFlags";
import { DesktopEntry } from "../../common/desktop-entries";
import { createContext } from "react";

type Args = {
  stdinArgs?: string[];
  cliFlags?: CLIFlags;
  desktopEntries?: DesktopEntry[];
};

export const ArgsContext = createContext<Args>({
  stdinArgs: [],
  cliFlags: {},
  desktopEntries: [],
});
