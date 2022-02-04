# Changelog

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
 - Lifecycle Screen: Automatically set response_timeout boolean if responseTime is set
 - KeypressInput: Allow hiding options

### Fixes
 - Magpie: Fall back to HTTP if submission via socket fails
 - PostTestScreen: Fix typos
 - MultipleChoiceInput: Correct test code
 - Fix spelling of 'magpie'
 - npmignore: Don't distribute template/package-lock.json
