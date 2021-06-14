<docs>
This is a pre-built image selection screen, with limited functionality, but simpler to use.

```vue
<Experiment>
    <ImageSelectionScreen
        :options="[
                {src: 'img/fries.jpg', label: 'fries'},
                {src: 'img/soup.jpg', label: 'soup' }
                ]"
        question="What do you eat?"
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
          question,
          options: options.map((o) => o.label)
        }"
      />
      <p v-if="question" v-text="question"></p>
      <ImageSelectionInput
        :options="options"
        :response.sync="$magpie.measurements.response"
        @update:response="$magpie.saveAndNextScreen()"
      />
    </template>
  </LifecycleScreen>
</template>

<script>
import Record from '../helpers/Record';
import ImageSelectionInput from '../inputs/ImageSelectionInput';
import LifecycleScreen from '../screens/LifecycleScreen';

export default {
  name: 'ImageSelectionScreen',
  components: {
    LifecycleScreen,
    ImageSelectionInput,
    Record
  },
  props: {
    /**
     * A question
     */
    question: {
      type: String,
      default: ''
    },
    /**
     * Forced choice options. Each option must be an object looking as follows `{src: 'image path', label: 'my label'}`
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
