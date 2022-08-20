import { Palette } from "./components/Palette/Palette";
import { AppRoot } from "./layouts/AppRoot";
import { MenuItem } from "@mui/material";

const App: React.FC = () => {
  return (
    <AppRoot>
      <Palette />
    </AppRoot>
  );
};

export default App;
