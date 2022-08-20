import Logger from "./logger";

export const readPipedArgs = async () => {
  Logger.info("Reading piped args...");
  const startTime = process.hrtime();
  let text = "";

  process.stdin.setEncoding("utf8");
  process.stdin.on("readable", function () {
    var chunk = process.stdin.read();
    if (chunk !== null) {
      text += chunk;
    }
  });

  return new Promise((resolve) => {
    process.stdin.on("end", function () {
      const endTime = process.hrtime(startTime);

      Logger.debug(
        `Read piped args in ${(
          endTime[0] * 1000 +
          endTime[1] / 1000000
        ).toFixed(0)}ms`
      );
      resolve(text);
    });
  });
};
