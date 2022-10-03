type RustDesktopEntry = {
  path: string;
  name: string;
  description: string;
  icon?: string;
};

declare module "*index.node" {
  export const getDesktopEntries: () => RustDesktopEntry[];
  export const getAppsMac: () => string;
}
