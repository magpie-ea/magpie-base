# magpie-base

Base components in Vue for _magpie-powered experiments.

## Installation

First, ensure you have [Node.js](https://nodejs.org/en/) installed.

To install this package, run `npm install -g magpie-base`.

To initialize a new experiment based on magpie (after installing the package), run `magpie new experiment-name`.

For more information, please visit [the project homepage](https://magpie-ea.github.io/magpie-site/)

The docs for the latest version are available at https://epic-bhabha-7e0966.netlify.app/


## Core Development

## Development principles
 * Components should not expose CSS classes for manipulation but instead offer customization either via unstyled slots or via props.
 * Pre-packaged screens are more of a convenience should be rather easy to replicate with normal userland code

### Docs
In order to spin up a local web server with the docs run `npm run docs`.

In order to build the docs run `npm run docs:build`.

The contents and organization of the docs are declared in `styleguide.config.js`. Each source folder should have a `docs.md` file with a general introduction to the feature in said folder.

The online docs are automatically built from the latest commit of the master branch.

### Vue components
All Vue components must be exported in `src/components/index.js` in order to be available in downstream projects without importing them.
