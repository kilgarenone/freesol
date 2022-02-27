import { server } from "../utils/server.js";
import log from "../utils/logger.js";
import { build } from "./build.js";

/**
 * Serve the site in watch mode
 */
export function serve(buildConfig, siteConfig, flags) {
  log.info(`Starting local server at http://localhost:${flags.port}`);

  const { outputDir } = buildConfig;

  build(buildConfig, siteConfig);
  server({ path: outputDir, port: flags.port });
}
