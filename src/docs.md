Magpie is a framework for easily and flexibly building psychological online experiments.

## Getting started

### Installing
To create an experiment you will need Node.js and npm and the magpie binary. You can install the magpie binary using npm as follows:

```bash
npm install -g magpie-base
```

### Creating a project
To create a new project, simply run

```bash
magpie new "project-name"
```

and magpie will create a new directory for you with a sample project.

Next, you will need to install the dependencies for your project using

```bash
npm install
```

### Running a development instance
To try out your project on your local machine, run

```bash
npm run serve
```

and click on the link it provides, to open the project in your browser.

### Building your project
To create a final build of your project that you can upload to a hoster like netlify, run

```bash
npm run build
```

### Getting started with the code
Magpie is based on [Vue.js](https://vuejs.org). If your are not familiar with Vue, please check out [this guide](https://vuejs.org/v2/guide/).

#### Structure
The bulk of your experiment will reside in `App.vue`.

The root component of your experiment will always be `<Experiment>`.
Each experiment is composed of a series of screens.
Each screen in turn is composed of multiple slides. Often you will probably only use one slide per screen, however.

#### Interface
Magpie adds a special magic property to all vue components that are descendants of `<Experiment>`: `$exp`
`$exp` allows you to access data you want to use in your trials, allows you to add results for submission, and gives you access to mouse tracking as well as control over which screen is displayed.
