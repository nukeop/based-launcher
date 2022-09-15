import { CustomTheme } from "./containers/CustomTheme";
import { PaletteContainer } from "./containers/PaletteContainer/PaletteContainer";
import { ArgsContext } from "./contexts/argsContext";
import { useArgs } from "./hooks/useArgs";
import { useDesktopEntries } from "./hooks/useDesktopEntries";
import { useFlags } from "./hooks/useFlags";
import { AppRoot } from "./layouts/AppRoot";

const App: React.FC = () => {
  const { stdinArgs } = useArgs();
  const { flags } = useFlags();
  const { desktopEntries } = useDesktopEntries();

  return (
    <ArgsContext.Provider
      value={{ stdinArgs, cliFlags: flags, desktopEntries }}
    >
      <AppRoot>
        <CustomTheme />
        <PaletteContainer />
      </AppRoot>
    </ArgsContext.Provider>
  );
};

export default App;
