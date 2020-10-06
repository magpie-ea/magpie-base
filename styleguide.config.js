const path = require('path');

module.exports = {
  // set your styleguidist configuration here
  title: 'Magpie',
  require: [path.join(__dirname, 'styleguidist/global.requires.js')],
  // components: 'src/components/**/[A-Z]*.vue',
  // defaultExample: true,
  sections: [
    {
      name: 'Base Components',
      components: 'src/components/*.vue'
    },
    {
      name: 'Inputs',
      components: 'src/components/inputs/*.vue'
    },
    {
      name: 'Screens',
      components: 'src/components/screens/*.vue'
    },
    {
      name: 'Helpers',
      components: 'src/components/helpers/*.vue'
    }
  ],
  // webpackConfig: {
  //   // custom config goes here
  // },
  exampleMode: 'expand'
};
