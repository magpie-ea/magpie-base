<docs>
This is a pre-built forced choice screen, with limited functionality, but simpler to use.

```vue
<Experiment>
  <template #screens>

    <ForcedChoiceScreen :options="['Yes', 'No']" question="Do you understand this question?" qud="Always do the opposite of what you are asked." />

    <DebugResultsScreen />

  </template>
</Experiment>
```
</docs>

<template>
  <Screen v-bind="$props">
    <template #0="{ measurements, saveAndNextScreen }">
      <p v-if="qud" v-text="qud"></p>
      <Record
        :data="{
          qud,
          question,
          options
        }"
      />
      <img v-if="picture" :src="picture" />
      <p v-if="question" v-text="question"></p>
      <ForcedChoiceInput
        :options="options"
        :response.sync="measurements.choice"
        @update:response="saveAndNextScreen"
      />
    </template>
  </Screen>
</template>

<script>
import Screen from '../Screen';
import ForcedChoiceInput from '@/components/inputs/ForcedChoiceInput';
import Record from '@/components/helpers/Record';

export default {
  name: 'ForcedChoiceScreen',
  components: {
    Record,
    ForcedChoiceInput,
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
      default: ''
    },
    /**
     * Forced choice options
     */
    options: {
      type: Array,
      required: true
    },
    /**
     * A picture stimulus (a path or link to a picture)
     */
    picture: {
      type: String,
      default: ''
    }
  }
};
</script>
<style scoped></style>
