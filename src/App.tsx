import { Palette } from "./components/Palette/Palette";
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
        <Palette />
      </AppRoot>
    </ArgsContext.Provider>
  );
};

export default App;
