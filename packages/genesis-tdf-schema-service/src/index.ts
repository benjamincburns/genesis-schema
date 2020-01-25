import express from "express";
import { getRootSchema } from "genesis-tdf-schema";

import { initLogging } from "./middleware/logging";

const out = console;
const PORT = 8080;
const HOST = "0.0.0.0";

export async function outputSchema() {
  const schema = await getRootSchema();
  out.log(JSON.stringify(schema));
}

export async function init() {
  const SCHEMA = await getRootSchema();
  const SCHEMA_OUTPUT = JSON.stringify(SCHEMA);
  const SCHEMA_PRETTY_OUTPUT = JSON.stringify(SCHEMA, null, 2);

  const app = express();

  // log out requests
  const rootLogger = initLogging(app);

  app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {

    // respond to health check
    if (req.path === "/health") {
      res.type("text/plain");
      res.status(200).send("ok");
    } else if (req.path !== "favicon.ico") {
      res.type("application/schema+json");
      if (req.query.pretty) {
        res.status(200).send(SCHEMA_PRETTY_OUTPUT);
      } else {
        res.status(200).send(SCHEMA_OUTPUT);
      }
    } else {
      next();
    }
  });

  rootLogger.info(`Listening on ${HOST}:${PORT}`);
  app.listen(PORT, HOST);
}

export default init;

if (require.main === module) {
  const stdout = console;

  init()
    .catch((err: Error) => {
      stdout.log(`Unhandled promise rejection: ${err.name}: ${err.message}\n${err.stack}`);
    });
}
