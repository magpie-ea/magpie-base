# Changelog

## [3.6.8] - 2024-12-11


## [3.6.7] - 2024-04-25

### Fixed

- fix(deploy-workflows): Update actions/cache to v4
- fix(deploy-workflows): Update peterjgrainger/action-create-branch to v3.0.0

### How to update existing projects

```sh
$ cd your-project
$ rm -rf node_modules # Or remove the node_modules folder by hand
$ rm package-lock.json # Or remove the package-lock.json file by hand
$ npm install magpie-base@3.6.x
```

- Change `.github/workflows/deploy-to-gh-pages.yml` according to adf5a8d11819479c71fa272bbeedbe4c8dd80c01

## [3.6.2] - 2024-03-17

### Fixed

- fix(deploy-to-gh-pages.yml): Add max-parallel declaration to strategy

### How to update existing projects

```sh
$ cd your-project
$ rm -rf node_modules # Or remove the node_modules folder by hand
$ rm package-lock.json # Or remove the package-lock.json file by hand
$ npm install magpie-base@3.6.x
```

 - Also make sure to update the Github Actions workflow file at `.github/workflows/deploy-to-gh-pages.yml` with this change: https://github.com/magpie-ea/magpie-base/commit/c785e5e05f132f3fccc1fa766eab48b797d5cdf2

## [3.6.1] - 2023-08-06

### Fixed

- Pin prettier dependency to v2.x for now to avoid build errors

### How to update existing projects

```sh
$ cd your-project
$ rm -rf node_modules # Or remove the node_modules folder by hand
$ rm package-lock.json # Or remove the package-lock.json file by hand
$ npm install magpie-base@3.6.x
```

## [3.6.0] - 2023-06-01

### New
- Upgrade to webpack v5 and support Node v18

### How to update existing projects

```sh
$ cd your-project
$ npm uninstall babel-eslint eslint eslint-config-prettier eslint-plugin-prettier eslint-plugin-vue prettier stylelint @samhammer/vue-cli-plugin-stylelint @vue/cli-plugin-eslint stylelint-config-standard
$ sed -i 's#"node": ".*"#"node": "14.x || 16.x || 18.x"#' package.json # Or if this doesn't work, replace the engines -> node value in your package.json with "14.x || 16.x || 18.x"
$ rm -rf node_modules # Or remove the node_modules folder by hand
$ rm package-lock.json # Or remove the package-lock.json file by hand
$ npm install magpie-base@3.6.x
```

Read more on [maintaining npm dependencies](https://www.carlrippon.com/upgrading-npm-dependencies/).

## 3.5.0

### New

- Templates: Setup templates to allow for multi-experiment repos

## 3.4.0

### New

 - Implement PreventCopyPaste helper component
 - Implement HideCursor component

### Fixed
 - Allow setting socketURL in magpie.config.js without connecting socket in experiment
 - TextareaInput: Allow setting width and height styles
 - Fix magpie new command: Do not override package.json edits

## 3.3.0

### New

 - Experiment: Implement validateSubmission
 - Screen: Add jump labels
 - Chat: Only emit message events & add participantLabel

### Fixed

 - Built-in Screens: Fix passing through of progress prop to basic Screen component
 - Chore: Change URL magpie-refactored-2.herokuapp.com -> magpie-demo.herokuapp.com

## 3.2.0

### Fixed

 - Receive groupLabel from backend and add to results
 - Fix collaborator dropout handling

## 3.1.2

### Fixed

 - Handle dropouts in interactive experiments
 - Fix github pages builds in project templates

## 3.1.1

### Fixed

 - Socket: Do not warn when checking for socket existence
 - Socket: Implement heartbeat to avoid session timeout

## 3.1.0

### New

- Extend MultipleChoiceScreen and MultipleChoiceInput with `optionsHtml` and `randomize`

## 3.0.0
This is the first production release of magpie-base.

### New
- Create MazeInput and MazeScreen
- Create abstract serial input component
- Create 'Magpie.warning's upon unhandled rejections
- PostTestScreen: add belowHighschool education level

### Changed
- SelfPacedReading: New interface **BREAKING CHANGE**
- Rename response_timeout to responseTimeout **BREAKING CHANGE**
- Rename response_time to responseTime **BREAKING CHANGE**
- Rename responseTime to responseTimeLimit **BREAKING CHANGE**

### Fixed
- Fix showroom template
- Fix vue.config.js: Find out dynamically whether we're on github actions

## 0.6.0

### New
- Magpie new command: add --template option with 'minimal' as default
- Don't record unset props in built-in screens
- CompletionScreen: Fix result property: "completed_text" => "response"
- Allow displaying debug warnings on screen by setting $magpie.warning
- Implement i18n (set language in magpie.config.js)

### Fixes
- LifecycleScreen: Improve docs for time props
- Test and fix SelfPacedReading
- SliderRangesScreen: Fix submit button
- RatingScreen: Add test and fix submit button
- index: Expose MultipleChoiceMatrixScreen as global
- MultipleChoiceScreen: Add test and fix component
- create.js:README: Add note about updating


## 0.5.3 - 2022-02-04

### Fixes
 - Avoid reusing components across Slide and Screen boundaries
 - Fix SelfPacedReading #prep="{done}" callback
 - Fix Socket#lastIterationResults type docs

## 0.5.2 - 2022-02-02

### Fixes
- Fix iterated experiment functionality

## 0.5.3 - 2022-02-04

### Fixes
 - Avoid reusing components across Slide and Screen boundaries
 - Fix SelfPacedReading #prep="{done}" callback
 - Fix Socket#lastIterationResults type docs

## 0.5.2 - 2022-02-02

### Fixes
- Fix iterated experiment functionality

## 0.5.1 - 2022-02-02

### Fixes

- TextareaScreen: Fix button display condition

## 0.5.0

### New

 - Record component: Add global prop
 - Experiment: Add record prop for declaratively recording expData
 - Lifecycle Screen: Automatically set responseTimeout boolean if responseTime is set
 - KeypressInput: Allow hiding options

### Fixes
 - Magpie: Fall back to HTTP if submission via socket fails
 - PostTestScreen: Fix typos
 - MultipleChoiceInput: Correct test code
 - Fix spelling of 'magpie'
 - npmignore: Don't distribute template/package-lock.json
