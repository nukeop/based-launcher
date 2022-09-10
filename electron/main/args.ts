import { CLIFlags } from "../../common/cliFlags";
import { readConfig } from "./config";
import Logger from "./logger";
import { program } from "commander";

export class ArgsProvider {
  static stdinArgs: string[];
  static flags: CLIFlags;
  private constructor() {}
}

export const readCLIFlags = () => {
  Logger.debug("Reading CLI flags...");
  const startTime = process.hrtime();

  if (!ArgsProvider.flags) {
    program
      .name("based-launcher")
      .version("1.0.0")
      .option("-t, --theme <path>", "Path to the theme file (CSS)")
      .option("--input-prefix <prefix>", "Prefix label for the input field");

    // @ts-ignore
    const resolvedArgv = import.meta.env.PROD
      ? process.argv
      : process.argv.slice(6);

    program.allowUnknownOption().parse(resolvedArgv, { from: "user" });
    const config = readConfig();

    ArgsProvider.flags = {
      ...config,
      ...program.opts(),
    };
  }

  const endTime = process.hrtime(startTime);
  Logger.debug(
    `Read CLI flags in ${(endTime[0] * 1000 + endTime[1] / 1000000).toFixed(
      0
    )}ms`
  );

  return ArgsProvider.flags;
};

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

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
        resolve(text.split("\n").filter(Boolean).filter(onlyUnique));
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
