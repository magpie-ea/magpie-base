<docs>
This is a pre-built multiple choice matrix screen, with limited functionality, but easier to use.

```vue
<Experiment>

    <MultipleChoiceMatrixScreen
        :questions="[
              'How is the weather today?',
              'How was your breakfast today?',
              'How do you like your job?',
              'What is your opinion of television?',
              'What is your opinion of folk music?'
            ]"
        :options="['Not enjoyable', 'Rather not enjoyable', 'OK', 'Rather enjoyable', 'Really enjoyable']"
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
          questions,
          options,
          randomize
        }"
      />
      <MultipleChoiceMatrixInput
        :options="options"
        :questions="questions"
        :randomize="randomize"
        :responses.sync="$magpie.measurements.responses"
      />
      <button
        v-if="
          $magpie.measurements.responses &&
          !$magpie.validateMeasurements.$invalid
        "
        @click="$magpie.saveAndNextScreen()"
      >
        Submit
      </button>
    </template>
  </LifecycleScreen>
</template>

<script>
import Record from '../helpers/Record';
import MultipleChoiceMatrixInput from '../inputs/MultipleChoiceMatrixInput';
import LifecycleScreen from '../screens/LifecycleScreen';

export default {
  name: 'MultipleChoiceMatrixScreen',
  components: {
    LifecycleScreen,
    MultipleChoiceMatrixInput,
    Record
  },
  props: {
    /**
     * The questions to ask
     */
    questions: {
      type: Array,
      required: true
    },
    /**
     * The possible options to choose from
     */
    options: {
      type: Array,
      required: true
    },
    /**
     * Whether to shuffle questions
     */
    randomize: {
      type: Boolean,
      default: false
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
  },
  data() {
    return { console };
  }
};
</script>
<style scoped></style>
