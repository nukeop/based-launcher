declare module "glasstron" {
  import { BrowserWindow as Electron_BrowserWindow } from "electron";
  export class BrowserWindow extends Electron_BrowserWindow {
    constructor(
      options: Electron_BrowserWindowConstructorOptions & {
        blur: boolean;
      }
    );
    setBlur(value: boolean): Promise<boolean>;
    getBlur(): Promise<boolean>;
    blurType: string;
    vibrancy: string;
  }
}

declare module "freedesktop-icons";
