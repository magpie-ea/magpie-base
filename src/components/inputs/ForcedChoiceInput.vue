<docs>

```vue
<Experiment>
  <template #screens>
    <Screen>
      <ForcedChoiceInput
          question="What's on the bread?"
          :options="['Ham', 'Jam']" />
    </Screen>
  </template>
</Experiment>
```

</docs>

<template>
  <div class="forced_choice">
    <div class="question">{{ question }}</div>
    <div class="options">
      <div
        v-for="option in options"
        :key="option"
        class="option"
        @click="onOptionClick(option)"
      >
        {{ option }}
      </div>
    </div>
  </div>
</template>

<script>
/**
 * Have the participant choose between multiple options.
 */
export default {
  name: 'ForcedChoiceInput',
  props: {
    /**
     * The question or task
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
    }
  },
  methods: {
    onOptionClick(option) {
      /**
       * Change event with the chosen option. Useful in combination with `answer.sync`
       */
      this.$emit('change:answer', option);
    }
  }
};
</script>

<style scoped>
.option {
  background-color: #5187ba;
  border: none;
  border-radius: 2px;
  color: white;
  cursor: pointer;
  display: inline-block;
  font-family: 'Lato', 'Noto Sans', sans-serif;
  font-size: 12px;
  line-height: 20px;
  font-weight: 700;
  letter-spacing: 0.9px;
  margin: 0 5px 20px 5px;
  outline: none;
  padding: 5px 10px;
  text-transform: uppercase;
}

.option:hover {
  background-color: #324d93;
}
</style>
