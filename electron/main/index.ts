import { IpcEvent } from "../../common/ipc";
import { LauncherActionType, LauncherOption } from "../../common/launcher";
import { ArgsProvider, readCLIFlags, readPipedArgs } from "./args";
import { readDesktopEntries } from "./freedesktop/desktop-apps";
import Logger from "./logger";
import { OptionsProvider } from "./options";
import { spawn } from "child_process";
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

    if (ArgsProvider.flags.mode === "apps") {
      await readDesktopEntries();
    }

    win = new BrowserWindow({
      title: "My launcher",
      icon: join(ROOT_PATH.public, "favicon.svg"),
      frame: false,
      blur: true,
      blurType: "vibrancy",
      vibrancy: "fullscreen-ui",
      webPreferences: {
        preload,
        nodeIntegration: true,
        contextIsolation: false,
        webSecurity: false,
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

  ipcMain.handle(IpcEvent.GetCliFlags, readCLIFlags);
  ipcMain.handle(IpcEvent.GetOptions, OptionsProvider.getOptions);

  ipcMain.on(
    IpcEvent.ExecuteAction,
    async (event, option: LauncherOption["onAction"]) => {
      switch (option.type) {
        case LauncherActionType.RunDesktopFile:
          if (option.payload) {
            spawn("gtk-launch", [option.payload]).unref();
            app.quit();
          }
          break;
        case LauncherActionType.Execute:
          option.payload && spawn(option.payload).unref();
          app.quit();
          break;
        case LauncherActionType.Return:
          console.log(option.payload);
          app.quit();
          break;
      }
    }
  );
})();
