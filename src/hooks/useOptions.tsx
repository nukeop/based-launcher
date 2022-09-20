import { IpcEvent } from "../../common/ipc";
import { LauncherOption } from "../../common/launcher";
import { ipcRenderer } from "electron";
import { useEffect, useState } from "react";

export const useOptions = () => {
  const [options, setOptions] = useState<LauncherOption[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const getOptions = async () => {
      const options = await ipcRenderer.invoke(IpcEvent.GetOptions);
      setOptions(options);
      setIsReady(true);
    };

    getOptions();
  }, []);

  return { options, isReady };
};
