import { IpcEvent } from "../../common/ipc";
import { ArgsContext } from "../App";
import { Palette } from "../components/Palette/Palette";
import { ipcRenderer } from "electron";
import { useCallback, useContext } from "react";

export const PaletteContainer: React.FC = () => {
  const { stdinArgs } = useContext(ArgsContext);

  const onClick = useCallback((item: string) => {
    ipcRenderer.send(IpcEvent.ReturnSelectedItem, item);
  }, []);

  return (
    <Palette
      options={
        stdinArgs?.map((arg, index) => ({
          id: arg,
          name: arg,
          description: arg,
          icon: null,
          onClick: () => onClick(arg),
        })) ?? []
      }
    />
  );
};
