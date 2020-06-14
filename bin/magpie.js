#!/usr/bin/env node

const { program } = require('commander');
program.version('0.1.0').usage('<command> [options]');

program
  .command('new <name>')
  .description(
    'create a new project based on _magpie, initialized with a sample experiment setup'
  )
  .action((name) => {
    require('../lib/create')(name);
  });

program.parse(process.argv);
