<docs>
This is a pre-built image selection screen, with limited functionality, but simpler to use.

```vue
<Experiment>

    <TextareaScreen
        question="What do you usually eat?"
        qud="Eating healthy is good for you."
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
          question
        }"
      />
      <p v-if="question" v-text="question"></p>
      <TextareaInput :response.sync="$magpie.measurements.response" />
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
import TextareaInput from '../inputs/TextareaInput';
import LifecycleScreen from '../screens/LifecycleScreen';

export default {
  name: 'TextareaScreen',
  components: {
    LifecycleScreen,
    TextareaInput,
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
