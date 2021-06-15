<docs>
This is a pre-built completion screen, with limited functionality, but simpler to use.

```vue
<Experiment>
    <CompletionScreen
        question="What happened in antartica?"
        text="One %s fell over three %s."
        :options="[
              ['horse', 'penguin', 'bird'],
              ['icicles', 'trees', 'bushes']
              ]"
    />

    <DebugResultsScreen />
</Experiment>
```
</docs>

<template>
  <!-- pass down props -->
  <LifecycleScreen v-bind="$attrs">
    <!-- pass down slots -->
    <template slot="fixation">
      <slot name="fixation"></slot>
    </template>
    <template slot="stimulus">
      <slot name="stimulus"></slot>
    </template>

    <template #task>
      <Record
        :data="{
          question,
          options,
          text
        }"
      />
      <p v-if="question" v-text="question"></p>
      <CompletionInput
        :text="text"
        :options="options"
        :response.sync="$magpie.measurements.completed_text"
        :responses.sync="$magpie.measurements.responses"
      />
      <button
        v-if="
          $magpie.measurements.responses &&
          $magpie.measurements.responses.filter(Boolean).length ===
            options.length
        "
        @click="$magpie.saveAndNextScreen()"
      >
        Next
      </button>
    </template>
  </LifecycleScreen>
</template>

<script>
import Record from '../helpers/Record';
import CompletionInput from '../inputs/CompletionInput';
import LifecycleScreen from '../screens/LifecycleScreen';

export default {
  name: 'CompletionScreen',
  components: {
    LifecycleScreen,
    CompletionInput,
    Record
  },
  props: {
    /**
     * A question
     */
    question: {
      type: String,
      required: true
    },
    /**
     * The text that is supposed to be completed. `%s` marks completions
     */
    text: {
      type: String,
      required: true
    },
    /**
     * An array of arrays with possible completions per `%s`
     */
    options: {
      type: Array,
      required: true
    },
    /**
     * Question under discussion. Always visible on the screen
     */
    qud: {
      type: String,
      default: ''
    },
    /**
     * Duration of the pause phase, don't set this, to avoid the pause altogether
     */
    pauseTime: {
      type: Number,
      default: 0
    },
    /**
     * Duration of the fixation point phase, don't set this to avoid showing the fixation point altogether
     */
    fixationTime: {
      type: Number,
      default: 0
    },
    /**
     * Duration of the stimulus phase, don't set this to avoid hiding the stimulus altogether
     */
    stimulusTime: {
      type: Number,
      default: 0
    },
    /**
     * How long the response should be enabled, don't set this, to avoid the timeout altogether
     */
    responseTime: {
      type: Number,
      default: 0
    }
  }
};
</script>
<style scoped></style>
