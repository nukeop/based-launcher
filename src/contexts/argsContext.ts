import { CLIFlags } from "../../common/cliFlags";
import { LauncherOption } from "common/launcher";
import { createContext } from "react";

type Args = {
  flags?: CLIFlags;
  options: LauncherOption[];
  isLoading: boolean;
};

export const ArgsContext = createContext<Args>({
  flags: {},
  options: [],
  isLoading: true,
});
