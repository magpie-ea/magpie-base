#!/usr/bin/env node

const { program } = require('commander');
const currentVersion = require('../package.json').version;
program.version(currentVersion).usage('<command> [options]');

program
  .command('new <name>')
  .description(
    'create a new project based on magpie, initialized with a sample experiment setup'
  )
  .action((name) => {
    require('../lib/create')(name);
  });

program.parse(process.argv);
