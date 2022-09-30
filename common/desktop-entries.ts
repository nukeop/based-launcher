export const DESKTOP_ENTRY_HEADER = "Desktop Entry";

export type DesktopEntry = {
  [DESKTOP_ENTRY_HEADER]: Record<string, string | undefined>;
  [key: string]: Record<string, string | undefined>;
};
