export type CLIFlagKeys = "theme" | "inputPrefix" | "mode" | "inputFormat";

export type CLIFlags = {
  [key in CLIFlagKeys]?: string;
};
