import { CLIFlags } from "../../common/cliFlags";
import { LauncherMode } from "../../common/modes";
import { readConfig } from "./config";
import Logger from "./logger";
import { Option, program } from "commander";

export class ArgsProvider {
  static stdinArgs: string[] = [];
  static flags: CLIFlags = {};

  static isReadingStdinDone = false;
  static isReadingFlagsDone = false;

  private constructor() {}
}

export const readCLIFlags = () => {
  Logger.debug("Reading CLI flags...");
  const startTime = process.hrtime();

  if (!ArgsProvider.isReadingFlagsDone) {
    program
      .name("based-launcher")
      .version("1.0.5")
      .addOption(
        new Option("-t, --theme <path>", "Path to the theme file (CSS)")
      )
      .addOption(
        new Option("-m, --mode <mode>", "Mode to run the launcher in")
          .default("dmenu")
          .choices(Object.values(LauncherMode))
      )
      .addOption(
        new Option(
          "--input-prefix <prefix>",
          "Prefix label for the input field"
        )
      )
      .addOption(
        new Option(
          "--input-format <format>",
          "Format of the input data (MIME type, several are supported)"
        )
          .default("text/plain")
          .choices(["text/plain", "application/json"])
      )
      .addOption(
        new Option(
          "--item-size <size>",
          "Height of each item in the list (in pixels), needed for theming"
        )
          .preset(28)
          .argParser(parseInt)
      )
      .addOption(
        new Option(
          "--item-size-with-description <size>",
          "Height of each item with description in the list (in pixels), needed for theming"
        )
          .preset(40)
          .argParser(parseInt)
      );

    // @ts-ignore
    const resolvedArgv = import.meta.env.PROD
      ? process.argv
      : process.argv.slice(6);

    program.allowUnknownOption().parse(resolvedArgv, { from: "user" });
    const config = readConfig();

    const opts = program.opts();

    Logger.debug("CLI flags:", opts);

    ArgsProvider.flags = {
      ...config,
      ...opts,
    };
    ArgsProvider.isReadingFlagsDone = true;
  }

  const endTime = process.hrtime(startTime);
  Logger.debug(
    `Read CLI flags in ${(endTime[0] * 1000 + endTime[1] / 1000000).toFixed(
      0
    )}ms`
  );

  return ArgsProvider.flags;
};

function onlyUnique(value: string, index: number, self: string[]) {
  return self.indexOf(value) === index;
}

export const readPipedArgs = async () => {
  Logger.debug("Reading piped args...");
  const startTime = process.hrtime();

  if (!ArgsProvider.isReadingStdinDone && !process.stdin.isTTY) {
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
        resolve(text.split("\n").filter(Boolean).filter(onlyUnique));
      });
    });
    ArgsProvider.isReadingStdinDone = true;
  }

  const endTime = process.hrtime(startTime);
  Logger.debug(
    `Read piped args in ${(endTime[0] * 1000 + endTime[1] / 1000000).toFixed(
      0
    )}ms`
  );

  return ArgsProvider.stdinArgs;
};
