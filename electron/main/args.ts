import Logger from "./logger";

class ArgsProvider {
  static stdinArgs: string[];

  private constructor() {}
}

export const readPipedArgs = async () => {
  Logger.info("Reading piped args...");
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
        resolve(text.split("\n"));
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
