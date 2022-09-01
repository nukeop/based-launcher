import { IpcEvent } from "../../common/ipc";
import { ipcRenderer } from "electron";
import { useEffect, useState } from "react";

export const useArgs = () => {
  const [stdinArgs, setStdinArgs] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const getArgs = async () => {
      const args = await ipcRenderer.invoke(IpcEvent.GetPipedArgs);
      setStdinArgs(args);
      setIsReady(true);
    };

    getArgs();
  }, []);

  return { stdinArgs, isReady };
};
