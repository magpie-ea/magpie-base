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
  <LifecycleScreen v-bind="$props">
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
        @click="nextAfterResponse"
      >
        Submit
      </button>
    </template>
    <template #feedback>
      <slot name="feedback"></slot>
    </template>
  </LifecycleScreen>
</template>

<script>
import Record from '../helpers/Record';
import MultipleChoiceMatrixInput from '../inputs/MultipleChoiceMatrixInput';
import LifecycleScreen from '../screens/LifecycleScreen';
/**
 * Inherits from LifecycleScreen
 */
export default {
  name: 'MultipleChoiceMatrixScreen',
  components: {
    LifecycleScreen,
    MultipleChoiceMatrixInput,
    Record
  },
  extends: LifecycleScreen,
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
    }
  }
};
</script>
<style scoped></style>
