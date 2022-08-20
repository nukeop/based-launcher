import { IpcEvent } from "../../common/ipc";
import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  getPipedArgs: () => ipcRenderer.invoke(IpcEvent.GetPipedArgs),
});
