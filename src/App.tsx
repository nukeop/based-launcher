import { CustomTheme } from "./containers/CustomTheme";
import { PaletteContainer } from "./containers/PaletteContainer/PaletteContainer";
import { ArgsContext } from "./contexts/argsContext";
import { useFlags } from "./hooks/useFlags";
import { useOptions } from "./hooks/useOptions";
import { AppRoot } from "./layouts/AppRoot";

const App: React.FC = () => {
  const { flags, isReady: isFlagsReady } = useFlags();
  const { options, isReady: isOptionsReady } = useOptions();

  return (
    <ArgsContext.Provider
      value={{ flags, options, isLoading: !isFlagsReady || !isOptionsReady }}
    >
      <AppRoot>
        <CustomTheme />
        <PaletteContainer />
      </AppRoot>
    </ArgsContext.Provider>
  );
};

export default App;
