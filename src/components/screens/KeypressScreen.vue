<docs>
This is a pre-built keypress screen, with limited functionality, but simpler to use.

```vue
<Experiment>
  <template #screens>

    <KeypressScreen
        question="Are fries healthy?"
        picture="img/fries.jpg"
        :keys="{
              f: 'yes',
              j: 'no'
            }"
    />

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
          question
        }"
      />
      <img v-if="picture" :src="picture" />
      <p v-if="question" v-text="question"></p>
      <KeypressInput
        :keys="keys"
        :response.sync="measurements.keypress"
        @update:response="saveAndNextScreen"
      />
    </template>
  </Screen>
</template>

<script>
import Screen from '../Screen';
import Record from '..//helpers/Record';
import KeypressInput from '..//inputs/KeypressInput';

export default {
  name: 'KeypressScreen',
  components: {
    KeypressInput,
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
     * A picture stimulus (a path or link to a picture)
     */
    picture: {
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
