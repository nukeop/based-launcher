import { DESKTOP_ENTRY_HEADER } from "../../common/desktop-entries";
import { LauncherActionType, LauncherOption } from "../../common/launcher";
import { ArgsProvider, readCLIFlags, readPipedArgs } from "./args";
import { DesktopEntriesProvider, readDesktopEntries } from "./desktop-apps";

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

    if (ArgsProvider.flags.inputFormat === "application/json") {
      const options = JSON.parse(ArgsProvider.stdinArgs.join(""));
      return OptionsProvider.processJsonOptions(options);
    } else {
      return ArgsProvider.stdinArgs.map((line, index) => ({
        id: (index + 1).toString(),
        name: line,
        onAction: {
          type: LauncherActionType.Return,
          payload: line,
        },
      }));
    }
  };

  static processJsonOptions = (
    options: Record<string, any>[]
  ): LauncherOption[] => {
    return options.map((option, index) => {
      if (!option.name) {
        throw new Error("Name is required");
      } else {
        return {
          ...option,
          id: option.id || (index + 1).toString(),
          onAction: option.onAction || {
            type: LauncherActionType.Return,
            payload: option.name,
          },
        } as LauncherOption;
      }
    });
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
