import { IpcEvent } from "../../common/ipc";
import { readPipedArgs } from "./args";
import Logger from "./logger";
import { app, shell, ipcMain } from "electron";
import { BrowserWindow } from "glasstron";
import { release } from "os";
import { join } from "path";

const startTime = process.hrtime();
// Disable GPU Acceleration for Windows 7
if (release().startsWith("6.1")) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === "win32") app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

export const ROOT_PATH = {
  // /dist
  dist: join(__dirname, "../.."),
  // /dist or /public
  public: join(__dirname, app.isPackaged ? "../.." : "../../../public"),
};

let win: BrowserWindow | null = null;
// Here, you can also use other preload
const preload = join(__dirname, "../preload/index.js");
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin
const url = process.env.VITE_DEV_SERVER_URL as string;
const indexHtml = join(ROOT_PATH.dist, "index.html");

async function createWindow() {
  Logger.info("Starting launcher");
  const endTime = process.hrtime(startTime);
  Logger.debug(
    `Launcher started in ${(endTime[0] * 1000 + endTime[1] / 1000000).toFixed(
      0
    )}ms (debug mode)`
  );

  await readPipedArgs();

  win = new BrowserWindow({
    title: "My launcher",
    icon: join(ROOT_PATH.public, "favicon.svg"),
    frame: false,
    titlebarStyle: "hiddenInset",
    blur: true,
    blurType: "vibrancy",
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

app.on("window-all-closed", () => {
  win = null;
  if (process.platform !== "darwin") app.quit();
});

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

ipcMain.handle(IpcEvent.GetPipedArgs, async () => readPipedArgs());
