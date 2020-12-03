const path = require('path');

module.exports = {
  // set your styleguidist configuration here
  title: 'Magpie',
  require: [path.join(__dirname, 'styleguidist/global.requires.js')],
  // components: 'src/components/**/[A-Z]*.vue',
  // defaultExample: true,
  sections: [
    {
      name: 'Magpie',
      content: 'src/docs.md'
    },
    {
      name: 'Base Components',
      components: 'src/components/*.vue'
    },
    {
      name: 'Inputs',
      content: 'src/components/inputs/docs.md',
      components: 'src/components/inputs/*.vue'
    },
    {
      name: 'Stimuli',
      content: 'src/components/stimuli/docs.md',
      components: 'src/components/stimuli/*.vue'
    },
    {
      name: 'Screens',
      content: 'src/components/screens/docs.md',
      components: 'src/components/screens/*.vue'
    },
    {
      name: 'Interactive',
      content: 'src/components/interactive/docs.md',
      components: 'src/components/interactive/*.vue'
    },
    {
      name: 'Helpers',
      components: 'src/components/helpers/*.vue'
    }
  ],
  // webpackConfig: {
  //   // custom config goes here
  // },
  exampleMode: 'expand',
  usageMode: 'expand'
};
