export type CLIFlagKeys = "theme" | "inputPrefix";

export type CLIFlags = {
  [key in CLIFlagKeys]: string;
};
