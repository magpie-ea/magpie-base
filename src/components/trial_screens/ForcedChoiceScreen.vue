<docs>
This is a pre-built forced choice screen, with limited functionality, but simpler to use.

```vue
<Experiment>

    <ForcedChoiceScreen
        :options="['Yes', 'No']"
        question="Do you understand this question?"
        qud="Always do the opposite of what you are asked." />

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
          question,
          options
        }"
      />
      <p v-if="question" v-text="question"></p>
      <ForcedChoiceInput
        :options="options"
        :response.sync="$magpie.measurements.response"
        @update:response="nextAfterResponse"
      />
    </template>

    <template #feedback><slot name="feedback"></slot></template>
  </LifecycleScreen>
</template>

<script>
import ForcedChoiceInput from '../inputs/ForcedChoiceInput';
import Record from '../helpers/Record';
import LifecycleScreen from '../screens/LifecycleScreen';

/**
 * Inherits from LifecycleScreen
 */
export default {
  name: 'ForcedChoiceScreen',
  components: {
    LifecycleScreen,
    Record,
    ForcedChoiceInput
  },
  extends: LifecycleScreen,
  props: {
    /**
     * A question
     */
    question: {
      type: String,
      default: ''
    },
    /**
     * Forced choice options
     */
    options: {
      type: Array,
      required: true
    }
  }
};
</script>
<style scoped></style>
