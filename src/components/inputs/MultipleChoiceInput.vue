<docs>

```vue
<Experiment>
    <Screen>

      <Slide>
        <p>How was your breakfast?</p>
        <MultipleChoiceInput
            :response.sync= "$magpie.measurements.breakfast"
            :options="['Not enjoyable', 'Rather not enjoyable', 'OK', 'Rather enjoyable', 'Really enjoyable']" />
        <button @click="$magpie.saveAndNextScreen();">Submit</button>
      </Slide>

    </Screen>
</Experiment>
```


```vue
<Experiment>
    <Screen>

      <Slide>
        <p>How was your breakfast?</p>
        <MultipleChoiceInput
            :response.sync= "$magpie.measurements.breakfast"
            orientation="horizontal"
            :options="['Not enjoyable', 'Rather not enjoyable', 'OK', 'Rather enjoyable', 'Really enjoyable']" />
        <button @click="$magpie.saveAndNextScreen();">Submit</button>
      </Slide>

    </Screen>
</Experiment>
```

```vue
<Experiment>
  <Screen>
      <p>Which sentence is ungrammatical?</p>
      <MultipleChoiceInput
          :response.sync= "$magpie.measurements.grammatical"
          :options="['banana', 'bear', 'horse', 'bread']">
        <template #banana>
          The <strong>banana</strong> went out to buy some groceries.
        </template>
        <template #bear>
          The <strong>bear</strong> raced past the barn froze.
        </template>
        <template #horse>
          The <strong>horse</strong> could not have been eaten why it was racing.
        </template>
        <template #bread>
          The <strong>bread</strong> was sour before it was made.
        </template>
      </MultipleChoiceInput>
      <button @click="$magpie.saveAndNextScreen();">Submit</button>
  </Screen>
  <DebugResultsScreen />
</Experiment>
```

</docs>

<template>
  <div :class="['multiple-choice', orientation]">
    <form>
      <div class="options">
        <label v-for="(option, i) in options" :key="i"
          ><input
            :value="option"
            type="radio"
            name="options"
            @input="$emit('update:response', option)"
          />
          <template v-if="labels"
            ><slot :name="option">{{ option }}</slot></template
          ></label
        >
      </div>
    </form>
  </div>
</template>

<script>
/**
 * Have the participant choose between multiple options.
 */
export default {
  name: 'MultipleChoiceInput',
  props: {
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
    },
    /**
     * Whether to display labels
     */
    labels: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    onOptionClick(option) {
      /**
       * Change event with the chosen option. Useful in combination with `response.sync`
       */
      this.$emit('update:response', option);
    }
  }
};
</script>

<style scoped>
.options label,
.options label * {
  cursor: pointer;
}

.multiple-choice.vertical {
  text-align: left;
  width: 500px;
  margin: 0 auto;
}

.multiple-choice.vertical label {
  display: block;
}

.multiple-choice.horizontal label {
  display: inline-block;
  margin: 0 10px;
}

.option:hover {
  background-color: #324d93;
}
</style>
