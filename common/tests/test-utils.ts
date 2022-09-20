import { LauncherActionType, LauncherOption } from "../launcher";

export const anOption = (option: Partial<LauncherOption>): LauncherOption => ({
  id: "1",
  name: "test",
  onAction: {
    type: LauncherActionType.Return,
  },
  ...option,
});

export const desktopEntryContents = (
  name: string,
  description: string,
  icon: string,
  exec: string
) => `# Comment
[Desktop Entry]
Type=Application
Version=1.0
Name=${name}
Comment=${description}
Icon=${icon}
Exec=${exec}
`;

export const givenArgv = (...argv: string[]) => {
  process.argv = ["node", "electron/main/args.test.ts", ...argv];
};
