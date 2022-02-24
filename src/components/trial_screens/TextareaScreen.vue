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
          (!$magpie.validateMeasurements.response ||
            !$magpie.validateMeasurements.response.$invalid)
        "
        @click="nextAfterResponse"
      >
        {{ $t('general.nextButton') }}
      </button>
    </template>
    <template #feedback>
      <slot name="feedback"></slot>
    </template>
  </LifecycleScreen>
</template>

<script>
import Record from '../helpers/Record';
import TextareaInput from '../inputs/TextareaInput';
import LifecycleScreen from '../screens/LifecycleScreen';

/**
 * Inherits from LifecycleScreen
 */
export default {
  name: 'TextareaScreen',
  components: {
    LifecycleScreen,
    TextareaInput,
    Record
  },
  extends: LifecycleScreen,
  props: {
    /**
     * A question
     */
    question: {
      type: String,
      required: true
    }
  }
};
</script>
<style scoped></style>
