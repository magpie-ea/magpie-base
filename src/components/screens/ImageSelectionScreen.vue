<docs>
This is a pre-built image selection screen, with limited functionality, but simpler to use.

```vue
<Experiment>
  <template #screens>

    <ImageSelectionScreen
        :options="[
                {src: 'img/fries.jpg', label: 'fries'},
                {src: 'img/soup.jpg', label: 'soup' }
                ]"
        question="What do you eat?"
        qud="Eating healthy is good for you."
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
          question,
          options: options.map((o) => o.label)
        }"
      />
      <p v-if="question" v-text="question"></p>
      <ImageSelectionInput
        :options="options"
        :response.sync="measurements.image_choice"
        @update:response="saveAndNextScreen"
      />
    </template>
  </Screen>
</template>

<script>
import Screen from '../Screen';
import Record from '..//helpers/Record';
import ImageSelectionInput from '..//inputs/ImageSelectionInput';

export default {
  name: 'ImageSelectionScreen',
  components: {
    ImageSelectionInput,
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
      default: ''
    },
    /**
     * Forced choice options. Each option must be an object looking as follows `{src: 'image path', label: 'my label'}`
     */
    options: {
      type: Array,
      required: true
    }
  }
};
</script>
<style scoped></style>
