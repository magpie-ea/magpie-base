<docs>
```vue
<Experiment>
  <template #screens>
    <Screen>
      <template #0="{responses}">
      <p>Fries or soup?</p>
      <ImageSelectionInput
          :options="[
              {src: 'fries.jpg', label: 'fries'},
              {src: 'soup.jpg', label: 'soup' }]"
          @update:response="$magpie.addTrialData({image_choice: $event}); $magpie.nextScreen()"
      />
      </template>
    </Screen>
  </template>
</Experiment>
```
</docs>

<template>
  <div class="image_selection">
    <div class="options">
      <div
        v-for="option in options"
        :key="option"
        class="option"
        @click="onOptionClick(option)"
      >
        <img
          :src="option.src"
          :alt="option.label"
          @click="onOptionClick(option.label)"
        />
      </div>
    </div>
  </div>
</template>

<script>
/**
 * Have the participant select an image
 */
export default {
  name: 'ImageSelectionInput',
  props: {
    /**
     * An array of option objects `{ src: '', label: '' }`
     */
    options: {
      type: Array,
      required: true
    }
  },
  methods: {
    onOptionClick(option) {
      /**
       * Change event with the selected image label
       */
      this.$emit('update:response', option);
    }
  }
};
</script>

<style scoped>
.options {
  display: flex;
  justify-content: center;
}

.option img {
  margin: 20px;
  height: 100px;
  width: auto;
  cursor: pointer;
}
</style>
