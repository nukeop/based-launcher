import { CustomTheme } from "./containers/CustomTheme";
import { PaletteContainer } from "./containers/PaletteContainer";
import { ArgsContext } from "./contexts/argsContext";
import { useArgs } from "./hooks/useArgs";
import { useDesktopEntries } from "./hooks/useDesktopEntries";
import { AppRoot } from "./layouts/AppRoot";

const App: React.FC = () => {
  const { stdinArgs } = useArgs();
  const { desktopEntries } = useDesktopEntries();

  return (
    <ArgsContext.Provider value={{ stdinArgs }}>
      <AppRoot>
        <CustomTheme />
        <PaletteContainer />
      </AppRoot>
    </ArgsContext.Provider>
  );
};

export default App;
