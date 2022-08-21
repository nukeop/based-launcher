import { PaletteContainer } from "./containers/PaletteContainer";
import { useArgs } from "./hooks/useArgs";
import { AppRoot } from "./layouts/AppRoot";
import { createContext } from "react";

type Args = {
  stdinArgs?: string[];
};

export const ArgsContext = createContext<Args>({ stdinArgs: [] });

const App: React.FC = () => {
  const { stdinArgs } = useArgs();
  return (
    <ArgsContext.Provider value={{ stdinArgs }}>
      <AppRoot>
        <PaletteContainer />
      </AppRoot>
    </ArgsContext.Provider>
  );
};

export default App;
