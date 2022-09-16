export enum LauncherActionType {
  Execute = "execute",
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
  icon?: string;
  onAction: LauncherAction;
};
