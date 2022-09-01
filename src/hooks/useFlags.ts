import { CLIFlags } from "../../common/cliFlags";
import { IpcEvent } from "../../common/ipc";
import { ipcRenderer } from "electron";
import { useEffect, useState } from "react";

export const useFlags = () => {
  const [flags, setFlags] = useState<CLIFlags | undefined>();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const getFlags = async () => {
      const flags = await ipcRenderer.invoke(IpcEvent.GetCliFlags);
      setFlags(flags);
      setIsReady(true);
    };

    getFlags();
  }, []);

  return { flags, isReady };
};
