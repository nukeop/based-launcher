import { LauncherMode } from "./modes";

export type CLIFlags = Partial<{
  theme: string;
  inputPrefix: string;
  mode: LauncherMode;
  inputFormat: "text/plain" | "application/json";
  itemSize: number;
  itemSizeWithDescription: number;
}>;

export type CLIFlagKeys = keyof CLIFlags;
