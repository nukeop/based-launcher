import { IpcEvent } from "../../common/ipc";
import { ipcRenderer } from "electron";
import { useEffect, useState } from "react";

export const useArgs = () => {
  const [stdinArgs, setStdinArgs] = useState<string[]>([]);

  useEffect(() => {
    ipcRenderer.invoke(IpcEvent.GetPipedArgs).then((args: string[]) => {
      setStdinArgs(args);
    });
  }, []);

  return { stdinArgs };
};
