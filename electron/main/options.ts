import { LauncherActionType, LauncherOption } from "../../common/launcher";
import { ArgsProvider, readCLIFlags, readPipedArgs } from "./args";
import { DesktopEntriesProvider, readDesktopEntries } from "./desktop-apps";
import { DESKTOP_ENTRY_HEADER } from "common/desktop-entries";

export class OptionsProvider {
  static options: LauncherOption[] = [];
  static isDone = false;
  private constructor() {}

  static getOptions = async () => {
    readCLIFlags();

    if (!OptionsProvider.isDone) {
      switch (ArgsProvider.flags.mode) {
        case "dmenu":
          OptionsProvider.options = await OptionsProvider.getOptionsFromStdin();
          break;
        case "apps":
          OptionsProvider.options =
            await OptionsProvider.getOptionsFromDesktopEntries();
          break;
      }
    }
    return OptionsProvider.options;
  };

  static getOptionsFromStdin = async (): Promise<LauncherOption[]> => {
    await readPipedArgs();
    return ArgsProvider.stdinArgs.map((line, index) => ({
      id: (index + 1).toString(),
      name: line,
      onAction: {
        type: LauncherActionType.Return,
        payload: line,
      },
    }));
  };

  static getOptionsFromDesktopEntries = async (): Promise<LauncherOption[]> => {
    await readDesktopEntries();
    return DesktopEntriesProvider.desktopEntries.map((entry, index) => ({
      id: (index + 1).toString(),
      name: entry[DESKTOP_ENTRY_HEADER].Name,
      description: entry[DESKTOP_ENTRY_HEADER].Comment,
      icon: entry[DESKTOP_ENTRY_HEADER].Icon,
      onAction: {
        type: LauncherActionType.Execute,
        payload: entry[DESKTOP_ENTRY_HEADER].Exec,
      },
    }));
  };
}