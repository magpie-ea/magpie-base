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
          <template v-if="labels">{{ option }}</template></label
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
