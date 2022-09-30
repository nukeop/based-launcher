export enum LauncherActionType {
  Execute = "execute",
  RunDesktopFile = "run-desktop-file",
  Return = "return",
}

// This tells the renderer what to do with the selected item
export type LauncherAction = {
  type: LauncherActionType;
  payload?: string;
};

export type LauncherOption = {
  id: string;
  name: string;
  description?: string;
  icon?: string | null;
  onAction: LauncherAction;
};
