const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const validateProjectName = require('validate-npm-package-name');

async function create(projectName) {
  const cwd = process.cwd();
  const targetDir = path.resolve(cwd, projectName || '.');

  if (fs.existsSync(targetDir)) {
    console.error(
      chalk.red(
        `Target directory ${targetDir} already exists. Please choose another name.`
      )
    );
    process.exit(1);
  }

  console.log(`Creating project in ${targetDir}`);
}

module.exports = (...args) => {
  return create(...args).catch((err) => {
    console.error(err);
    process.exit(1);
  });
};
