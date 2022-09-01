import Logger from "./logger";
import { program } from "commander";

type CLIFlagKeys = "theme";

type CLIFlags = {
  [key in CLIFlagKeys]: string;
};

class ArgsProvider {
  static stdinArgs: string[];
  static flags: CLIFlags;
  private constructor() {}
}

export const readCLIFlags = () => {
  if (!ArgsProvider.flags) {
    program
      .name("my-launcher")
      .version("1.0.0")
      .option("-t, --theme <path>", "Path to the theme file (CSS)");

    program.allowUnknownOption().parse(process.argv.slice(6), { from: "user" });

    ArgsProvider.flags = program.opts();
  }

  return ArgsProvider.flags;
};

export const readPipedArgs = async () => {
  Logger.debug("Reading piped args...");
  const startTime = process.hrtime();

  if (!ArgsProvider.stdinArgs && !process.stdin.isTTY) {
    ArgsProvider.stdinArgs = await new Promise((resolve) => {
      let text = "";

      process.stdin.setEncoding("utf8");
      process.stdin.on("readable", function () {
        var chunk = process.stdin.read();
        if (chunk !== null) {
          text += chunk;
        }
      });
      process.stdin.on("end", function () {
        resolve(text.split("\n").filter(Boolean));
      });
    });
  }

  const endTime = process.hrtime(startTime);
  Logger.debug(
    `Read piped args in ${(endTime[0] * 1000 + endTime[1] / 1000000).toFixed(
      0
    )}ms`
  );

  return ArgsProvider.stdinArgs;
};
