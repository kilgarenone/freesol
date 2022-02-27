#!/usr/bin/env node
import chalkTemplate from 'chalk-template';
import meow from 'meow';
import { cliProcess } from './modules/cli-process.js';

const cli = meow(
  chalkTemplate`
  {yellow Start the current site:}

  {cyan $ nanogen start [options]}

  {yellow Build the current site:}

  {cyan $ nanogen build [options]}

  {underline {yellow Options}}
  {cyan -c, --config <file-path>}  Path to the config file (default: site.config.json)
  {cyan -p, --port <port-number>}  Port to use for local server (default: 3000)

  {cyan -h, --help}                Display this help text
  {cyan -v, --version}             Display Nanogen version
  `,
  {
    importMeta: import.meta,
    flags: {
      config: {
        type: 'string',
        default: 'site.config.json',
        alias: 'c',
      },
      port: {
        type: 'string',
        default: '3000',
        alias: 'p',
      },
      help: {
        type: 'boolean',
        alias: 'h',
      },
      version: {
        type: 'boolean',
        alias: 'v',
      },
    },
  }
);

cliProcess(cli.input, cli.flags);
