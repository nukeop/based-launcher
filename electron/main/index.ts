import { IpcEvent } from "../../common/ipc";
import { readCLIFlags, readPipedArgs } from "./args";
import { getDesktopEntries } from "./desktop-apps";
import Logger from "./logger";
import { app, shell, ipcMain } from "electron";
import { BrowserWindow } from "glasstron";
import { join } from "path";

export const ROOT_PATH = {
  dist: join(__dirname, "../.."),
  public: join(__dirname, app.isPackaged ? "../.." : "../../../public"),
};

process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

let win: BrowserWindow | null = null;
const preload = join(__dirname, "../preload/index.js");
const url = process.env.VITE_DEV_SERVER_URL as string;
const indexHtml = join(ROOT_PATH.dist, "index.html");

(async () => {
  const startTime = process.hrtime();
  await readCLIFlags();

  // Set application name for Windows 10+ notifications
  if (process.platform === "win32") app.setAppUserModelId(app.getName());

  if (!app.requestSingleInstanceLock()) {
    app.quit();
    process.exit(0);
  }

  async function createWindow() {
    Logger.debug("Starting launcher");
    const endTime = process.hrtime(startTime);
    Logger.debug(
      `Launcher started in ${(endTime[0] * 1000 + endTime[1] / 1000000).toFixed(
        0
      )}ms (debug mode)`
    );

    readPipedArgs();

    const parsingStart = process.hrtime();
    const entries = await getDesktopEntries();
    const parsingEnd = process.hrtime(parsingStart);

    Logger.debug(
      `Parsed desktop entries in ${
        parsingEnd[0] * 1000 + parsingEnd[1] / 1000000
      }ms`
    );

    win = new BrowserWindow({
      title: "My launcher",
      icon: join(ROOT_PATH.public, "favicon.svg"),
      frame: false,
      titlebarStyle: "hiddenInset",
      blur: true,
      blurType: "vibrancy",
      vibrancy: "fullscreen-ui",
      webPreferences: {
        preload,
        nodeIntegration: true,
        contextIsolation: false,
      },
    });

    if (app.isPackaged) {
      win.loadFile(indexHtml);
    } else {
      win.loadURL(url);
    }

    // Make all links open with the browser, not with the application
    win.webContents.setWindowOpenHandler(({ url }) => {
      if (url.startsWith("https:")) shell.openExternal(url);
      return { action: "deny" };
    });
  }

  app.whenReady().then(createWindow);

  app.on("second-instance", () => {
    if (win) {
      // Focus on the main window if the user tried to open another
      if (win.isMinimized()) win.restore();
      win.focus();
    }
  });

  app.on("activate", () => {
    const allWindows = BrowserWindow.getAllWindows();
    if (allWindows.length) {
      allWindows[0].focus();
    } else {
      createWindow();
    }
  });

  app.on("window-all-closed", () => {
    win = null;
    if (process.platform !== "darwin") app.quit();
  });

  ipcMain.handle(IpcEvent.GetPipedArgs, readPipedArgs);
  ipcMain.handle(IpcEvent.GetCliFlags, readCLIFlags);

  ipcMain.on(IpcEvent.ReturnSelectedItem, (event, item) => {
    console.log(item);
    app.quit();
  });
})();
