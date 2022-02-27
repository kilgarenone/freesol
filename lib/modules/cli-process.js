import path from 'path';
import fs from 'fs';
import { build } from '../modules/build.js';
import { serve } from '../modules/serve.js';
import log from '../utils/logger.js';

export function cliProcess(input = [], flags = {}) {
  const command = input.length > 0 ? input[0] : null;

  const config = JSON.parse(fs.readFileSync(flags.config, 'utf-8'));

  if (command === 'start') {
    serve(config, flags);
  } else if (command === 'build') {
    build(config);
  } else {
    log.error('Invalid command');
  }
}
