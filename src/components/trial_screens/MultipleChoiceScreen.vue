<docs>
This is a pre-built multiple choice screen, with limited functionality, but easier to use.

```vue
<Experiment>
    <MultipleChoiceScreen
        question="How was your breakfast?"
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
          question,
          options,
          orientation
        }"
      />
      <p v-if="question" v-text="question"></p>
      <MultipleChoiceInput
        :options="options"
        :orientation="orientation"
        :response.sync="$magpie.measurements.response"
      />
      <button
        v-if="
          $magpie.measurements.response &&
          (!$magpie.validateMeasurements.response ||
            !$magpie.validateMeasurements.response.$invalid)
        "
        @click="$magpie.saveAndNextScreen()"
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
import MultipleChoiceInput from '../inputs/MultipleChoiceInput';
import LifecycleScreen from '../screens/LifecycleScreen';

/**
 * Have participants choose answer from multiple options
 *
 * Inherits from LifecycleScreen
 *
 * **Screen Measurements**
 *
 * |Measurement|Type|Description|
 * |--|---|---|
 * |responseTime|int|Time between display of this screen until the screen is left|
 * |response_timeout|boolean|Whether the response time limit was reached|
 * |qud *(optional)*|string||
 * |pauseTime *(optional)*|int||
 * |fixationTime *(optional)*|int||
 * |stimulusTime *(optional)*|int||
 * |responseTimeLimit *(optional)*|int|The response time limit|
 * |feedbackTime *(optional)*|int||
 * |question|string||
 * |options|array||
 * |orientation|string||
 * |response|string|The chosen option|
 *
 */
export default {
  name: 'MultipleChoiceScreen',
  components: {
    LifecycleScreen,
    MultipleChoiceInput,
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
    },
    /**
     * The possible options to choose from
     */
    options: {
      type: Array,
      required: true
    },
    /**
     * Whether to display 'vertical' or 'horizontal'
     */
    orientation: {
      type: String,
      default: 'vertical'
    }
  }
};
</script>
<style scoped></style>
