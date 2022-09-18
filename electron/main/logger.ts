import * as winston from "winston";

const format = winston.format.printf(
  ({ level, message, label, timestamp, ...rest }) => {
    return `${timestamp} [${level}]: ${message} ${
      Object.keys(rest).length ? JSON.stringify(rest) : ""
    }`;
  }
);

const env = process.env.NODE_ENV || "development";

const Logger = winston.createLogger({
  level: process.env.LOG_LEVEL ?? "info",
  transports: [
    new winston.transports.Console({
      format:
        env !== "production"
          ? winston.format.combine(
              winston.format.colorize(),
              winston.format.timestamp(),
              format
            )
          : winston.format.combine(
              winston.format.timestamp(),
              winston.format.json(),
              winston.format.prettyPrint()
            ),
      // @ts-ignore
      silent: env == "test",
    }),
  ],
});

export default Logger;
