export type CLIFlagKeys =
  | "theme"
  | "inputPrefix"
  | "mode"
  | "inputFormat"
  | "itemSize"
  | "itemSizeWithDescription";

export type CLIFlags = {
  [key in CLIFlagKeys]?: string | number;
};
