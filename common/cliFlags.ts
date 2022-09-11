export type CLIFlagKeys = "theme" | "inputPrefix" | "mode";

export type CLIFlags = {
  [key in CLIFlagKeys]: string;
};
