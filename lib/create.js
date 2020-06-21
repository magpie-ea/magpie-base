// Ideas from https://medium.com/northcoders/creating-a-project-generator-with-node-29e13b3cd309
// and https://github.com/vuejs/vue-cli

const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const slash = require('slash');
const validateProjectName = require('validate-npm-package-name');

function normalizeFilePaths(files) {
  Object.keys(files).forEach((file) => {
    const normalized = slash(file);
    if (file !== normalized) {
      files[normalized] = files[file];
      delete files[file];
    }
  });
  return files;
}

async function writeFileTree(dir, files) {
  Object.keys(files).forEach((name) => {
    const filePath = path.join(dir, name);
    fs.ensureDirSync(path.dirname(filePath));
    fs.writeFileSync(filePath, files[name]);
  });
}

function generatePackageFile(projectName) {
  return {
    name: projectName,
    version: '0.1.0',
    private: true,
    scripts: {
      serve: 'vue-cli-service serve',
      build: 'vue-cli-service build',
      lint: 'vue-cli-service lint'
    },
    devDependencies: {
      '@vue/cli-service': '~4.3.0',
      'vue-template-compiler': '^2.6.11',
      eslint: '^5.16.0',
      'eslint-plugin-vue': '^5.0.0'
    },
    dependencies: {
      'magpie-base': '^0.1.0',
      vue: '^2.6.11'
    },
    browserslist: ['> 1%', 'last 2 versions', 'not dead']
  };
}

function generateReadme(projectName) {
  return [
    `# ${projectName}\n`,
    'This is a sample experiment using _magpie.\n',
    'First, set up the project with `npm install`\n',
    'To run the project locally, run `npm run serve`\n',
    'To build the project for deployment (e.g. to Netlify), run `npm run build`\n',
    'For more information, see our [getting started guide](https://magpie-ea.github.io/magpie-site/experiments/introduction.html).',
    '\n'
  ].join('\n');
}

async function copyToDirectory(sourceDir, targetDir) {
  const filesToCreate = fs.readdirSync(sourceDir);

  filesToCreate.forEach((name) => {
    const sourceFilePath = path.join(sourceDir, name);

    const stats = fs.statSync(sourceFilePath);

    if (stats.isFile()) {
      const sourceFileContents = fs.readFileSync(sourceFilePath, 'utf8');

      const targetFilePath = path.join(targetDir, name);
      fs.ensureDirSync(path.dirname(targetFilePath));
      fs.writeFileSync(targetFilePath, sourceFileContents, 'utf8');
    } else if (stats.isDirectory()) {
      copyToDirectory(path.join(sourceDir, name), path.join(targetDir, name));
    }
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

  const files = {
    'package.json': JSON.stringify(generatePackageFile(projectName), null, 2),
    'README.md': generateReadme(projectName)
  };

  normalizeFilePaths(files);

  await writeFileTree(targetDir, files);

  const sourceDir = path.join(`${__dirname}`, 'templates');

  await copyToDirectory(sourceDir, targetDir);

  console.log(
    `Successfully created project ${chalk.yellow(
      projectName
    )}.\nGet started with the following commands:\n\n` +
      chalk.cyan(`cd ${projectName} && npm install && npm run serve\n`) +
      `\nPlease see README.md for more information.`
  );
}

module.exports = (...args) => {
  return create(...args).catch((err) => {
    console.error(err);
    process.exit(1);
  });
};
