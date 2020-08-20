<template>
  <div class="image_selection">
    <div class="question">{{ question }}</div>
    <div class="options">
      <div
        class="option"
        v-for="option in options"
        @click="onOptionClick(option)"
      >
        <img
          :src="option.src"
          @click="onOptionClick(option.label)"
          :alt="option.label"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImageSelectionInput',
  props: {
    question: {
      type: String,
      required: true
    },
    options: {
      type: Array,
      required: true
    },
    answer: {
      type: String,
      required: true
    }
  },
  methods: {
    onOptionClick(option) {
      this.$emit('change:answer', option);
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
