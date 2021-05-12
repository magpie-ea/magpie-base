<docs>
This is a pre-built rating screen, with limited functionality, but simpler to use.

```vue
<Experiment>
  <template #screens>

    <RatingScreen
        question="How healthy do you usually eat?"
        qud="Eating healthy is good for you."
        option-left="Very healthy"
        option-right="Very unhealthy"
    />

    <DebugResultsScreen />

  </template>
</Experiment>
```
</docs>

<template>
  <Screen v-bind="$attrs">
    <template #0="{ measurements, saveAndNextScreen }">
      <p v-if="qud" v-text="qud"></p>
      <Record
        :data="{
          qud,
          question,
          optionLeft,
          optionRight
        }"
      />
      <p v-if="question" v-text="question"></p>
      <RatingInput
        :left="optionLeft"
        :right="optionRight"
        :response.sync="measurements.response"
        @update:response="saveAndNextScreen()"
      />
    </template>
  </Screen>
</template>

<script>
import Screen from '../Screen';
import Record from '..//helpers/Record';
import RatingInput from '..//inputs/RatingInput';

export default {
  name: 'RatingScreen',
  components: {
    RatingInput,
    Record,
    Screen
  },
  props: {
    /**
     * Question under discussion. Always visible on the screen
     */
    qud: {
      type: String,
      default: ''
    },
    /**
     * A question
     */
    question: {
      type: String,
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
    }
  }
};
</script>
<style scoped></style>
