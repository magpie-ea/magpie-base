<docs>
This is a pre-built slider rating screen, with limited functionality, but simpler to use.

```vue
<Experiment>
    <SliderRangesScreen
        question="How often do you eat meat, vegetarian or vegan?"
        qud="Eating healthy is good for you."
        :ranges="['meat', 'vegetarian', 'vegan']"
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
          optionLeft,
          optionRight,
          interval,
          ranges,
          min,
          max
        }"
      />
      <p v-if="question" v-text="question"></p>
      <SliderInput
        :left="optionLeft"
        :right="optionRight"
        :min="min"
        :max="max"
        :interval="interval"
        :ranges="ranges"
        :response.sync="$magpie.measurements.response"
      />
      <ul v-if="$magpie.measurements.response">
        <li v-for="(value, i) in $magpie.measurements.response" :key="i">
          {{ value }} {{ ranges[i] }}
        </li>
      </ul>
      <button
        v-if="
          $magpie.measurements.response &&
          !$magpie.validateMeasurements.response.$invalid
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
import SliderInput from '../inputs/SliderInput';
import LifecycleScreen from '../screens/LifecycleScreen';

export default {
  name: 'SliderRangesScreen',
  components: {
    LifecycleScreen,
    SliderInput,
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
     * The labels for the ranges
     */
    ranges: {
      type: Array,
      required: true
    },
    /**
     * Left label for rating
     */
    optionLeft: {
      type: String,
      default: ''
    },
    /**
     * Right label for rating
     */
    optionRight: {
      type: String,
      default: ''
    },
    /**
     * Minimal slider value
     */
    min: {
      type: Number,
      optional: true,
      default: 0
    },
    /**
     * Maximum slider value
     */
    max: {
      type: Number,
      optional: true,
      default: 100
    },
    /**
     * Interval between slider values
     */
    interval: {
      type: Number,
      optional: true,
      default: 1
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
