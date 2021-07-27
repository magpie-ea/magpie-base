<docs>
This is a pre-built keypress screen, with limited functionality, but simpler to use.

```vue
<Experiment>
    <KeypressScreen
        question="Are fries healthy?"
        :feedback-time="1000"
        :keys="{
              '~': 'yes',
              '^': 'no'
            }"
    >
      <template #stimulus>
        <img src="img/fries.jpg" />
      </template>
      <template #feedback>
        You are correct.
      </template>
    </KeypressScreen>

    <DebugResultsScreen />

</Experiment>
```
</docs>

<template>
  <!-- pass down props -->
  <LifecycleScreen v-bind="$props">
    <!-- pass down slots -->
    <template slot="fixation">
      <slot name="fixation"><FixationCross /></slot>
      <KeypressInput :keys="keys" />
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
      <KeypressInput
        :keys="keys"
        :response.sync="$magpie.measurements.response"
        @update:response="nextAfterResponse"
      />
    </template>

    <template #feedback>
      <slot name="feedback"></slot>
    </template>
  </LifecycleScreen>
</template>

<script>
import Record from '../helpers/Record';
import KeypressInput from '../inputs/KeypressInput';
import LifecycleScreen from '../screens/LifecycleScreen';
import FixationCross from '../stimuli/FixationCross';

/**
 * Inherits from LifecycleScreen
 */
export default {
  name: 'KeypressScreen',
  components: {
    FixationCross,
    LifecycleScreen,
    KeypressInput,
    Record
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
     * An object with keys mapped to option labels
     */
    keys: {
      type: Object,
      required: true
    }
  }
};
</script>
<style scoped></style>
