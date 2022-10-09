type RustDesktopEntry = {
  path: string;
  name: string;
  description?: string;
  icon?: string;
};

declare module "*index.node" {
  export const getDesktopApps: (
    platform: NodeJS.Platform
  ) => RustDesktopEntry[];
}
