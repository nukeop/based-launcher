import { DesktopEntry } from "../../common/desktop-entries";
import { IpcEvent } from "../../common/ipc";
import { ipcRenderer } from "electron";
import { useEffect, useState } from "react";

export const useDesktopEntries = () => {
  const [desktopEntries, setDesktopEntries] = useState<DesktopEntry[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const getDesktopEntries = async () => {
      const entries = await ipcRenderer.invoke(IpcEvent.GetDesktopEntries);
      setDesktopEntries(entries);
      setIsReady(true);
    };

    getDesktopEntries();
  }, []);

  return { desktopEntries, isReady };
};
