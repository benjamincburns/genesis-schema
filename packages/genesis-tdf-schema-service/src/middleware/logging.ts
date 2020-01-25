import express, { Express } from "express";
import winston from "winston";

export function initLogging(app: Express): winston.Logger {
  // setup logging
  const logFormat = winston.format.json();

  const rootLogger = winston.createLogger({
    level: "info",
    format: logFormat,
    defaultMeta: { service: "genesis-tdf-schema-service" },
    transports: [
      new winston.transports.Console({
        stderrLevels: ["error", "warn"],
      }),
    ],
  });

  app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    const startTimestamp = new Date().getTime();
    // can't use arrow operator below because we need the `this` keyword to work
    res.once("finish", function(this: express.Response) {
      const endTimestamp = new Date().getTime();
      const elapsedTimeMillis = (endTimestamp - startTimestamp);
      const url = req.path;
      const method = req.method;
      const statusCode = this.statusCode;

      const logger = rootLogger.child({
        elapsedTimeMillis,
        url,
        method,
        statusCode,
        // TODO: fill this with more stuff about the request, client IP, etc
      });

      logger.info("request processed"); // no need to format the message, it'll spit out as json
    });

    next();
  });

  return rootLogger;
}
