import { LauncherOption } from "../../common/launcher";

export const anOption = (option: Partial<LauncherOption>) => ({
  id: "1",
  name: "test",
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
