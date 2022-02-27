import path from "path";
import fs from "fs";
import { build } from "../modules/build.js";
import { serve } from "../modules/serve.js";
import log from "../utils/logger.js";
import buildConfig from "../build-config.js";

export function cliProcess(input = [], flags = {}) {
  const command = input.length > 0 ? input[0] : null;

  const siteConfig = JSON.parse(fs.readFileSync(flags.config, "utf8"));

  if (command === "start") {
    serve(buildConfig, siteConfig, flags);
  } else if (command === "build") {
    build(buildConfig, siteConfig);
  } else {
    log.error("Invalid command");
  }
}
