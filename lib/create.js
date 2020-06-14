const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const validateProjectName = require('validate-npm-package-name');

async function writeFileTree(dir, files) {
  Object.keys(files).forEach((name) => {
    const filePath = path.join(dir, name);
    fs.ensureDirSync(path.dirname(filePath));
    fs.writeFileSync(filePath, files[name]);
  });
}

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

  const pkg = {
    name: projectName,
    version: '0.1.0',
    private: true,
    devDependencies: {},
    dependencies: {
      'magpie-base': '^0.1.0',
      vue: '^2.6.11'
    }
  };

  await writeFileTree(targetDir, {
    'package.json': JSON.stringify(pkg, null, 2)
  });
}

module.exports = (...args) => {
  return create(...args).catch((err) => {
    console.error(err);
    process.exit(1);
  });
};
